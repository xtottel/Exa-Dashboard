// routes/api-key.ts
import { Router } from 'express';
import { apiKeyController } from '@/controllers/api-key';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// API Key management routes (require authentication)
router.get('/', authenticateToken, apiKeyController.getApiKeys);
router.post('/', authenticateToken, apiKeyController.createApiKey);
router.put('/:id', authenticateToken, apiKeyController.updateApiKey);
router.delete('/:id', authenticateToken, apiKeyController.deleteApiKey);
router.get('/:id/secret', authenticateToken, apiKeyController.getApiKeySecret);

export { router as apiKeyRoutes };