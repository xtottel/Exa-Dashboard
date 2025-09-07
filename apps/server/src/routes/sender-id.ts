// import { Router } from 'express';
// import { authenticateToken } from '@/middleware/auth';
// import {
//   createSenderId,
//   getSenderIds,
//   updateSenderId,
//   deleteSenderId,
//   verifySenderId // Add this import
// } from '@/controllers/sender-id';

// const router = Router();

// router.use(authenticateToken);

// router.post('/', createSenderId);
// router.get('/', getSenderIds);
// router.put('/:id', updateSenderId);
// router.delete('/:id', deleteSenderId);
// router.post('/verify', verifySenderId); // Add this new route

// export { router as senderIdRoutes };

// routes/sender-id.ts
import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { senderIdController } from '@/controllers/sender-id';

const router = Router();

router.use(authenticateToken);

router.post('/', senderIdController.createSenderId);
router.get('/', senderIdController.getSenderIds);
router.put('/:id', senderIdController.updateSenderId);
router.delete('/:id', senderIdController.deleteSenderId);
router.post('/verify', senderIdController.verifySenderId);

export { router as senderIdRoutes };