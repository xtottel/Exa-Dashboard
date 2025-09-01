import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  getCreditBalance,
  purchaseCredits,
  getCreditHistory,
  getInvoices,
  getInvoice
} from '@/controllers/credits';

const router = Router();

router.use(authenticateToken);

router.get('/balance', getCreditBalance);
router.post('/purchase', purchaseCredits);
router.get('/history', getCreditHistory);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoice);

export { router as creditsRoutes };