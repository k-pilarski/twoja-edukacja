import { Router } from 'express';
// DODANY IMPORT academicSuccess:
import { createCheckoutSession, handleWebhook, academicSuccess } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// NOWA TRASA (wymaga tokenu logowania)
router.post('/academic-success', protect, academicSuccess);

export default router;