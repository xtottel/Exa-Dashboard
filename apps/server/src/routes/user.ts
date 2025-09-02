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

// MFA routes
router.get('/mfa', userController.getMfaSettings);
router.post('/mfa/setup', userController.setupMfa);
router.post('/mfa/verify', userController.verifyMfa);
router.post('/mfa/disable', userController.disableMfa);
router.post('/mfa/regenerate-backup-codes', userController.regenerateBackupCodes);
router.post('/mfa/verify-backup-code', userController.verifyBackupCode);

export { router as userRoutes };