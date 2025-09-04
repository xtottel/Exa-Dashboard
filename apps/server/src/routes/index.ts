// routes/index.ts
import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { smsRoutes } from './sms';
import { otpRoutes } from './otp';
import { contactsRoutes } from './contacts';
import { templatesRoutes } from './templates';
import { senderIdRoutes } from './sender-id';
import { creditRoutes } from './credit';
import { reportsRoutes } from './reports';
import { settingsRoutes } from './settings';
import { businessRoutes } from './business';
import { apiKeyRoutes } from './api-key';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/sms', smsRoutes);
router.use('/otp', otpRoutes);
router.use('/contacts', contactsRoutes);
router.use('/templates', templatesRoutes);
router.use('/sender-ids', senderIdRoutes);
router.use('/credit', creditRoutes);
router.use('/reports', reportsRoutes);
router.use('/settings', settingsRoutes);
router.use('/business', businessRoutes);
router.use('/api-keys', apiKeyRoutes); // This will create /api/api-keys routes

export { router as apiRoutes };