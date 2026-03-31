import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();

export const addLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    if (!courseId) return res.status(400).json({ error: "Brak ID kursu" });
    if (!req.user?.userId) return res.status(401).json({ error: "Brak autoryzacji" });

    const { title, contentType, contentPath, videoUrl, durationMin, order, isFree } = req.body;

    const course = await prisma.course.findFirst({
      where: { 
        id: Number(courseId),
        instructor: { userId: req.user.userId }
      }
    });

    if (!course) {
      return res.status(403).json({ error: "Nie masz uprawnień do edycji tego kursu." });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        contentType,
        contentPath,
        videoUrl,
        durationMin: Number(durationMin),
        order: Number(order),
        isFree: Boolean(isFree),
        courseId: Number(courseId)
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas dodawania lekcji." });
  }
};