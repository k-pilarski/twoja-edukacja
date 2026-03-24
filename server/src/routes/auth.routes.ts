import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
  res.json({ message: 'Masz dostęp do tajnych danych!', user: (req as any).user });
});

router.get('/instructor-panel', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), (req, res) => {
  res.json({ message: 'Witaj w panelu instruktora! Możesz tu dodawać kursy.' });
});

router.get('/admin-only', protect, authorizeRoles('ADMIN'), (req, res) => {
  res.json({ message: 'Witaj, Wielki Administratorze.' });
});

export default router;