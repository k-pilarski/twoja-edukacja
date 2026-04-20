import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// React potrzebuje tej trasy, żeby wiedzieć, czy ktoś jest zalogowany po odświeżeniu strony!
router.get('/me', protect, getMe); 

export default router;