import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} from '@/controllers/templates';

const router = Router();

router.use(authenticateToken);

router.post('/', createTemplate);
router.get('/', getTemplates);
router.get('/:id', getTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export { router as templatesRoutes };