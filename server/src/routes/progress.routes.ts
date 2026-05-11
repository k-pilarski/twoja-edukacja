import { Router } from 'express';
import { markLessonCompleted, getUserProgress } from '../controllers/progress.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, getUserProgress);

router.post('/:lessonId/complete', protect, markLessonCompleted);

export default router;