// routes/user.routes.ts
import { Router } from 'express';
import { userController } from '@/controllers/user';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get current user profile
router.get('/profile', userController.getCurrentUser);

// Update user profile
router.put('/profile', userController.updateProfile);

// Change password
router.post('/change-password', userController.changePassword);

// Get active sessions
router.get('/sessions', userController.getActiveSessions);

// Revoke specific session
router.delete('/sessions/:sessionId', userController.revokeSession);

// Revoke all sessions except current
router.delete('/sessions', userController.revokeAllSessions);

export { router as userRoutes };