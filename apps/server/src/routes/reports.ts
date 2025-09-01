import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  getSMSReports,
  getOTPReports,
  getNetworkDistribution,
  exportReports
} from '@/controllers/reports';

const router = Router();

router.use(authenticateToken);

router.get('/sms', getSMSReports);
router.get('/otp', getOTPReports);
router.get('/network-distribution', getNetworkDistribution);
router.post('/export', exportReports);

export { router as reportsRoutes };