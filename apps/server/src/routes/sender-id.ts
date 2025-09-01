import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  createSenderId,
  getSenderIds,
  updateSenderId,
  deleteSenderId
} from '@/controllers/sender-id';

const router = Router();

router.use(authenticateToken);

router.post('/', createSenderId);
router.get('/', getSenderIds);
router.put('/:id', updateSenderId);
router.delete('/:id', deleteSenderId);

export { router as senderIdRoutes };