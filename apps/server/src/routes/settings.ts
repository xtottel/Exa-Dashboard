import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  getBusinessSettings,
  updateBusinessSettings,
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook
} from '@/controllers/settings';

const router = Router();

router.use(authenticateToken);

// Business settings
router.get('/business', getBusinessSettings);
router.put('/business', updateBusinessSettings);

// API Keys
router.get('/api-keys', getApiKeys);
router.post('/api-keys', createApiKey);
router.put('/api-keys/:id', updateApiKey);
router.delete('/api-keys/:id', deleteApiKey);

// Webhooks
router.get('/webhooks', getWebhooks);
router.post('/webhooks', createWebhook);
router.put('/webhooks/:id', updateWebhook);
router.delete('/webhooks/:id', deleteWebhook);

export { router as settingsRoutes };