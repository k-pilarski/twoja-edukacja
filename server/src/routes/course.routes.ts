import { Router } from 'express';
import { 
  getAllCourses, 
  getNewestCourses, 
  getBestsellers,
  getCourseById,
  getMyCourses,
  togglePublishStatus,
  createCourse,
  addLesson
} from '../controllers/course.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// --- TRASY PUBLICZNE (Statyczne - muszą być wyżej!) ---
router.get('/', getAllCourses); 
router.get('/newest', getNewestCourses); 
router.get('/bestsellers', getBestsellers);

// --- TRASY CHRONIONE (Statyczne - muszą być wyżej!) ---
router.get('/my-courses', protect, getMyCourses);

// --- TRASY DYNAMICZNE Z PARAMETREM :id (Zawsze na dole zapytań GET!) ---
router.get('/:id', getCourseById); 

// --- INNE TRASY (PATCH, POST) ---
router.patch('/:id/toggle-publish', protect, togglePublishStatus);
router.post('/', protect, createCourse);
router.post('/:courseId/lessons', protect, addLesson);

export default router;