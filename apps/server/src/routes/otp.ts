import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  sendOTP,
  verifyOTP,
  getOTPHistory,
  getOTPStats
} from '@/controllers/otp';

const router = Router();

router.use(authenticateToken);

// Send OTP
router.post('/send', sendOTP);

// Verify OTP
router.post('/verify', verifyOTP);

// Get OTP history
router.get('/history', getOTPHistory);

// Get OTP statistics
router.get('/stats', getOTPStats);

export { router as otpRoutes };