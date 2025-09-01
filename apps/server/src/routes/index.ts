import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { smsRoutes } from './sms';
import { otpRoutes } from './otp';
import { contactsRoutes } from './contacts';
import { templatesRoutes } from './templates';
import { senderIdRoutes } from './sender-id';
import { creditsRoutes } from './credits';
import { reportsRoutes } from './reports';
import { settingsRoutes } from './settings';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/sms', smsRoutes);
router.use('/otp', otpRoutes);
router.use('/contacts', contactsRoutes);
router.use('/templates', templatesRoutes);
router.use('/sender-ids', senderIdRoutes);
router.use('/credits', creditsRoutes);
router.use('/reports', reportsRoutes);
router.use('/settings', settingsRoutes);

export { router as apiRoutes };