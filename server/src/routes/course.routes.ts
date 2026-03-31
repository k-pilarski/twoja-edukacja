import { Router } from 'express';
import { createCourse, getInstructorCourses } from '../controllers/course.controller.js';
import { addLesson } from '../controllers/lesson.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Tworzenie kursu - dostęp dla INSTRUCTOR i ADMIN
router.post('/', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), createCourse);

// Pobieranie własnych kursów instruktora
router.get('/my-courses', protect, authorizeRoles('INSTRUCTOR'), getInstructorCourses);

// Dodawanie lekcji do kursu
router.post('/:courseId/lessons', protect, authorizeRoles('INSTRUCTOR'), addLesson);

export default router;