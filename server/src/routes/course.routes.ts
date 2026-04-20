import { Router } from 'express';
import { 
  getAllCourses, 
  getNewestCourses, 
  getBestsellers,
  getMyCourses,
  togglePublishStatus,
  createCourse,
  addLesson
} from '../controllers/course.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// --- TRASY PUBLICZNE ---
router.get('/', getAllCourses); 
router.get('/newest', getNewestCourses); 
router.get('/bestsellers', getBestsellers);

// --- TRASY CHRONIONE ---
router.get('/my-courses', protect, getMyCourses);
router.patch('/:id/toggle-publish', protect, togglePublishStatus);

// --- TRASY ZAPISUJĄCE ---
router.post('/', protect, createCourse);
router.post('/:courseId/lessons', protect, addLesson);

export default router;