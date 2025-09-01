import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  createContactGroup,
  getContactGroups,
  getContactGroup,
  updateContactGroup,
  deleteContactGroup,
  addContactToGroup,
  getContactsInGroup,
  updateContact,
  deleteContact,
  importContacts
} from '@/controllers/contacts';

const router = Router();

router.use(authenticateToken);

// Contact groups
router.post('/groups', createContactGroup);
router.get('/groups', getContactGroups);
router.get('/groups/:groupId', getContactGroup);
router.put('/groups/:groupId', updateContactGroup);
router.delete('/groups/:groupId', deleteContactGroup);

// Contacts within groups
router.post('/groups/:groupId/contacts', addContactToGroup);
router.get('/groups/:groupId/contacts', getContactsInGroup);
router.put('/groups/:groupId/contacts/:contactId', updateContact);
router.delete('/groups/:groupId/contacts/:contactId', deleteContact);

// Bulk operations
router.post('/import', importContacts);

export { router as contactsRoutes };