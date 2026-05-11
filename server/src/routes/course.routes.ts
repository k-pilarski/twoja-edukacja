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

// Middleware pomocniczy do "miękkiej" autoryzacji
// Pozwala odczytać token, ale nie blokuje dostępu gościom
const optionalAuth = (req: any, res: any, next: any) => {
  // Jeśli w nagłówku jest token, używamy standardowego protect
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  // Jeśli nie ma tokena, idziemy dalej jako gość
  next();
};

// --- TRASY PUBLICZNE ---
router.get('/', getAllCourses); 
router.get('/newest', getNewestCourses); 
router.get('/bestsellers', getBestsellers);

// --- TRASY CHRONIONE ---
router.get('/my-courses', protect, getMyCourses);

// --- TRASY DYNAMICZNE Z PARAMETREM :id ---
router.get('/:id', optionalAuth, getCourseById); 

// --- INNE TRASY ---
router.patch('/:id/toggle-publish', protect, togglePublishStatus);
router.post('/', protect, createCourse);
router.post('/:courseId/lessons', protect, addLesson);

export default router;