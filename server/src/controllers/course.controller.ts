import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, categoryId, requirements, thumbnailUrl } = req.body;
    
    // Sprawdzamy czy user i userId istnieją (inaczej TS wywali błąd przy Prisma)
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Błąd autoryzacji - brak ID użytkownika" });
    }

    const userId = req.user.userId;

    // Szukamy instruktora
    const instructor = await prisma.instructor.findUnique({
      where: { userId: userId }
    });

    if (!instructor) {
      return res.status(403).json({ error: "Musisz najpierw uzupełnić profil instruktora." });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: Number(price),
        thumbnailUrl,
        categoryId: Number(categoryId),
        instructorId: instructor.id,
        requirements: {
          create: requirements.map((text: string) => ({ text }))
        }
      },
      include: {
        requirements: true,
        category: true
      }
    });

    res.status(201).json(newCourse);
  } catch (error: any) {
    console.error("Błąd tworzenia kursu:", error);
    res.status(500).json({ error: "Błąd podczas tworzenia kursu." });
  }
};

export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) return res.status(401).json({ error: "Brak autoryzacji" });
    
    const userId = req.user.userId;

    const courses = await prisma.course.findMany({
      where: { instructor: { userId: userId } },
      include: { category: true, _count: { select: { lessons: true } } }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania kursów." });
  }
};