
// routes/sms.ts
import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { smsController } from '@/controllers/sms';

const router = Router();

//router.use(authenticateToken);

// Send SMS
router.post('/send', authenticateToken, smsController.sendSMS);

// Bulk Send SMS
//router.post('/bulk-send', authenticateToken, smsController.bulkSendSMS);

// Get SMS history
router.get('/history', authenticateToken, smsController.getSMSHistory);

// Get specific SMS details
router.get('/:id', authenticateToken, smsController.getSMSDetails);

// Get SMS statistics
router.get('/stats/overview', authenticateToken, smsController.getSMSStats);

// Get SMS analytics
router.get('/analytics/overview', authenticateToken, smsController.getSMSAnalytics);

export { router as smsRoutes };