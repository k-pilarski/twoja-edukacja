import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return res.status(404).json({ error: 'Nie znaleziono kursu.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: course.title,
              description: course.description.substring(0, 255),
            },
            unit_amount: Math.round(Number(course.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/course/${courseId}?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/course/${courseId}?canceled=true`,
      metadata: {
        courseId: course.id.toString(),
        userId: userId.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Błąd Stripe Checkout:', error);
    res.status(500).json({ error: 'Błąd podczas inicjowania płatności.' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error(`Błąd weryfikacji webhooka: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = Number(session.metadata?.courseId);
    const userId = Number(session.metadata?.userId);

    if (courseId && userId) {
      try {
        // Tabela Purchase wymaga amountPaid - wyciągamy to z sesji Stripe
        const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
        
        await prisma.purchase.create({
          data: {
            userId: userId,
            courseId: courseId,
            amountPaid: amountPaid
          }
        });
        console.log(`Sukces! Użytkownik ${userId} otrzymał dostęp do kursu ${courseId}. Zapłacono: ${amountPaid} PLN`);
      } catch (dbError) {
        console.error('Błąd zapisu zakupu w bazie danych:', dbError);
      }
    }
  }

  res.json({ received: true });
};

export const academicSuccess = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    if (!courseId || !userId) {
      return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    // Sprawdzamy, czy użytkownik ma już ten kurs, by nie dublować wpisów
    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, courseId: Number(courseId) }
    });

    if (!existingPurchase) {
      await prisma.purchase.create({
        data: {
          userId,
          courseId: Number(courseId),
          amountPaid: 0 // Zapisujemy 0 lub stałą kwotę na potrzeby uczelni
        }
      });
      console.log(`[Akademicki Checkout] Sukces! Użytkownik ${userId} otrzymał dostęp do kursu ${courseId}.`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Błąd akademickiego webhooka:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas nadawania dostępu.' });
  }
};