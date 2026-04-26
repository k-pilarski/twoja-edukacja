import { Router } from 'express';
import { markLessonCompleted, getUserProgress } from '../controllers/progress.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint do pobierania wszystkich postępów zalogowanego użytkownika
router.get('/', protect, getUserProgress);

// Endpoint do oznaczania konkretnej lekcji jako ukończonej (Task #26 & #27)
router.post('/:lessonId/complete', protect, markLessonCompleted);

export default router;