import type { Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const markLessonCompleted = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { lessonId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Brak autoryzacji.' });
      return;
    }

    if (!lessonId || isNaN(Number(lessonId))) {
      res.status(400).json({ error: 'Nieprawidłowe ID lekcji.' });
      return;
    }

    // Upsert: Aktualizuje jeśli istnieje, tworzy jeśli nie istnieje.
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: { // To działa dzięki @@unique w schemacie Prisma
          userId: Number(userId),
          lessonId: Number(lessonId),
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId: Number(userId),
        lessonId: Number(lessonId),
        isCompleted: true,
      },
    });

    res.json({ 
      message: 'Lekcja oznaczona jako ukończona.', 
      progress 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji postępu:', error);
    res.status(500).json({ error: 'Błąd serwera podczas zapisywania postępu.' });
  }
};

// Dodatkowy endpoint: Pobieranie postępów usera (np. do paska postępu na froncie)
export const getUserProgress = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Brak autoryzacji.' });
      return;
    }

    const progress = await prisma.progress.findMany({
      where: { userId: Number(userId) },
    });

    res.json(progress);
  } catch (error) {
    console.error('Błąd pobierania postępów:', error);
    res.status(500).json({ error: 'Błąd serwera.' });
  }
};