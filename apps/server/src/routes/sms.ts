import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  sendSMS,
  getSMSHistory,
  getSMSDetails,
  getSMSStats
} from '@/controllers/sms';

const router = Router();

router.use(authenticateToken);

// Send SMS
router.post('/send', sendSMS);

// Get SMS history with pagination and filters
router.get('/history', getSMSHistory);

// Get specific SMS details
router.get('/:id', getSMSDetails);

// Get SMS statistics
router.get('/stats/overview', getSMSStats);

export { router as smsRoutes };