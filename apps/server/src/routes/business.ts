// // routes/business.ts
// import { Router } from 'express';
// import { businessController } from '@/controllers/business';
// import { authenticateToken } from '@/middleware/auth';

// const router = Router();

// // All business routes require authentication
// router.use(authenticateToken);

// // Business profile routes
// router.get('/profile', businessController.getBusinessProfile);
// router.put('/profile', businessController.updateBusinessProfile);

// // Team management routes
// router.get('/team', businessController.getTeamMembers);
// router.post('/team/invite', businessController.inviteTeamMember);
// router.put('/team/:memberId', businessController.updateTeamMember);
// router.delete('/team/:memberId', businessController.removeTeamMember);
// router.delete('/invitations/:invitationId', businessController.cancelInvitation);
// router.post('/invitations/:invitationId/resend', businessController.resendInvitation);
// router.post('/invitations/accept', businessController.acceptInvitation);

// export { router as businessRoutes };


// routes/business.ts
import { Router } from 'express';
import { businessController } from '@/controllers/business';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Business profile routes (require authentication)
router.get('/profile', authenticateToken, businessController.getBusinessProfile);
router.put('/profile', authenticateToken, businessController.updateBusinessProfile);

// Team management routes (require authentication)
router.get('/team', authenticateToken, businessController.getTeamMembers);
router.post('/team/invite', authenticateToken, businessController.inviteTeamMember);
router.put('/team/:memberId', authenticateToken, businessController.updateTeamMember);
router.delete('/team/:memberId', authenticateToken, businessController.removeTeamMember);
router.delete('/invitations/:invitationId', authenticateToken, businessController.cancelInvitation);
router.post('/invitations/:invitationId/resend', authenticateToken, businessController.resendInvitation);

// Accept invitation route (DOES NOT require authentication)
router.post('/invitations/accept', businessController.acceptInvitation);

export { router as businessRoutes };