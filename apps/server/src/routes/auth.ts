
import { Router } from 'express';
import { authController } from '@/controllers/auth';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/otp', authController.otp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.get('/refresh', authController.refresh);
router.get('/verify', authController.verify);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.post('/logout-all', authenticateToken, authController.logoutAllSessions);
router.delete('/sessions/:sessionId', authenticateToken, authController.logoutSession);

export { router as authRoutes };