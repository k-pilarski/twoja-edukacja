import { Router } from 'express';
import { uploadFile, getSecureUrl } from '../controllers/upload.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), upload.single('file'), uploadFile);

router.post('/secure-url', protect, getSecureUrl);

export default router;