
import { Router } from 'express';
import { userController } from '@/controllers/user';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.get('/profile', userController.getCurrentUser);
router.put('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.get('/sessions', userController.getActiveSessions);
router.delete('/sessions/:sessionId', userController.revokeSession);
router.post('/sessions/revoke-all', userController.revokeAllSessions);

export { router as userRoutes };