import { Router } from 'express';
import { createCheckoutSession, handleWebhook, academicSuccess } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.post('/academic-success', protect, academicSuccess);

export default router;