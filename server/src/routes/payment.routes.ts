import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import express from 'express';

const router = Router();

// Endpoint do tworzenia sesji - chroniony (tylko dla zalogowanych)
router.post('/create-checkout-session', protect, createCheckoutSession);

// Endpoint dla Webhooka - Stripe wymaga dostępu do surowego body (raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;