import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// TRASY PUBLICZNE
// ==========================================

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, minPrice, maxPrice } = req.query;

    const whereCondition: any = { 
      isPublished: true 
    };

    if (search) {
      whereCondition.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      whereCondition.categoryId = Number(categoryId);
    }

    if (minPrice || maxPrice) {
      whereCondition.price = {};
      if (minPrice) whereCondition.price.gte = Number(minPrice);
      if (maxPrice) whereCondition.price.lte = Number(maxPrice);
    }

    const courses = await prisma.course.findMany({
      where: whereCondition,
      include: {
        category: true,
        instructor: { 
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      },
      orderBy: { publishDate: 'desc' }
    });

    res.json(courses);
  } catch (error) {
    console.error('Błąd pobierania kursów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania kursów.' });
  }
};

export const getNewestCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      take: 10,
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true } } } }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error('Błąd pobierania nowości:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania najnowszych kursów.' });
  }
};

export const getBestsellers = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: {
        purchases: { _count: 'desc' }
      },
      take: 10,
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { purchases: true } }
      }
    });
    res.json(courses);
  } catch (error) {
    console.error('Błąd pobierania bestsellerów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania bestsellerów.' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Spróbuj wyciągnąć userId z tokena (jeśli został przesłany)
    const authHeader = req.headers.authorization;
    let userId: number | undefined;

    if (authHeader) {
      // Prosta ręczna weryfikacja jeśli middleware zawiedzie
      // Tutaj zakładamy, że korzystasz z JWT i masz dostęp do userId
      userId = (req as any).user?.userId; 
    }

    console.log(`Pobieranie kursu ${id} dla użytkownika: ${userId || 'Gość'}`);

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        instructor: { include: { user: true } },
        lessons: true,
        purchases: userId ? { where: { userId: Number(userId) } } : false
      },
    });

    if (!course) return res.status(404).json({ error: 'Kurs nie znaleziony' });

    const isPurchased = course.purchases && course.purchases.length > 0;
    console.log(`Czy kurs kupiony przez użytkownika ${userId}: ${isPurchased}`);

    res.json({ ...course, isPurchased });
  } catch (error) {
    console.error("Błąd w getCourseById:", error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// ==========================================
// TRASY CHRONIONE (Instruktor)
// ==========================================

export const getMyCourses = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    if (!userId) {
      return res.status(401).json({ error: 'Brak autoryzacji.' });
    }

    const instructorProfile = await prisma.instructor.findUnique({
      where: { userId: userId }
    });

    if (!instructorProfile) {
      return res.json([]); 
    }

    const myCourses = await prisma.course.findMany({
      where: { instructorId: instructorProfile.id },
      include: {
        category: true,
        _count: { select: { lessons: true, purchases: true } }
      },
      orderBy: { publishDate: 'desc' }
    });

    res.json(myCourses);
  } catch (error) {
    console.error('Błąd pobierania kursów instruktora:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania Twoich kursów.' });
  }
};

export const togglePublishStatus = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    });

    if (!course) return res.status(404).json({ error: 'Nie znaleziono kursu.' });

    if (course.instructor?.userId !== userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji.' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !course.isPublished }
    });

    res.json({ 
      message: updatedCourse.isPublished ? 'Kurs opublikowany.' : 'Cofnięto publikację.',
      isPublished: updatedCourse.isPublished 
    });
  } catch (error) {
    console.error('Błąd zmiany statusu publikacji:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas zmiany statusu.' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    const instructorProfile = await prisma.instructor.findUnique({
      where: { userId: userId }
    });

    if (!instructorProfile) {
      return res.status(403).json({ error: 'Brak profilu instruktora.' });
    }

    const { title, description, price, categoryId, thumbnailUrl } = req.body;

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        thumbnailUrl: thumbnailUrl || null,
        instructorId: instructorProfile.id
      }
    });

    res.json(newCourse);
  } catch (error) {
    console.error('Błąd tworzenia kursu:', error);
    res.status(500).json({ error: 'Błąd podczas tworzenia kursu.' });
  }
};

export const addLesson = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const userId = Number((req as any).user?.userId || (req as any).user?.id);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    });

    if (!course) return res.status(404).json({ error: 'Nie znaleziono kursu.' });

    if (course.instructor?.userId !== userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji.' });
    }

    const { title, contentType, contentPath, videoUrl, durationMin, order, isFree } = req.body;

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        contentType,
        contentPath: contentPath || null,
        videoUrl: videoUrl || null,
        durationMin: Number(durationMin) || 0,
        order: Number(order) || 1,
        isFree: Boolean(isFree),
        courseId: courseId
      }
    });

    res.json(newLesson);
  } catch (error) {
    console.error('Błąd dodawania lekcji:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas dodawania lekcji.' });
  }
};