import { Router } from 'express';
import { creditsController } from '@/controllers/credits'; // Fixed import path
import { authenticateToken } from '@/middleware/auth';

const router = Router();

router.get('/balance', authenticateToken, creditsController.getCreditBalance);
router.post('/purchase', authenticateToken, creditsController.purchaseCredits);
router.get('/history', authenticateToken, creditsController.getCreditHistory);
router.post('/transfer', authenticateToken, creditsController.transferCredits);
router.get('/invoices', authenticateToken, creditsController.getInvoices);
router.get('/invoices/:id', authenticateToken, creditsController.getInvoice);

export { router as creditRoutes };