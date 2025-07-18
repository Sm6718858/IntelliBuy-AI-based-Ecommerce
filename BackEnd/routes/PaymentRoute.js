import express from 'express';
import { checkout, verify } from '../controller/PaymentController.js';
const router = express.Router();

router.post('/checkout',checkout);
router.post('/verify',verify)
export default router;