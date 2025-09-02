// routes/business.ts
import { Router } from 'express';
import { businessController } from '@/controllers/business';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All business routes require authentication
router.use(authenticateToken);

// Business profile routes
router.get('/profile', businessController.getBusinessProfile);
router.put('/profile', businessController.updateBusinessProfile);

// Team management routes
router.get('/team', businessController.getTeamMembers);
router.post('/team/invite', businessController.inviteTeamMember);
router.put('/team/:memberId', businessController.updateTeamMember);
router.delete('/team/:memberId', businessController.removeTeamMember);
router.delete('/invitations/:invitationId', businessController.cancelInvitation);
router.post('/invitations/:invitationId/resend', businessController.resendInvitation);

export { router as businessRoutes };