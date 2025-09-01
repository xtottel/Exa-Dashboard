import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const createContactGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const businessId = req.user.businessId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    const group = await prisma.contactGroup.create({
      data: {
        businessId,
        name,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: 'Contact group created successfully',
      data: group
    });

  } catch (error) {
    console.error('Create contact group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contact group'
    });
  }
};

export const getContactGroups = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, search } = req.query;

    const where: any = { businessId };
    
    if (search) {
      where.name = { contains: search as string };
    }

    const [groups, total] = await Promise.all([
      prisma.contactGroup.findMany({
        where,
        include: {
          _count: {
            select: { contacts: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.contactGroup.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: groups.map(group => ({
        ...group,
        recipients: group._count.contacts
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get contact groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact groups'
    });
  }
};

export const getContactGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const businessId = req.user.businessId;

    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      },
      include: {
        _count: {
          select: { contacts: true }
        }
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...group,
        recipients: group._count.contacts
      }
    });

  } catch (error) {
    console.error('Get contact group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact group'
    });
  }
};

export const updateContactGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const businessId = req.user.businessId;

    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    const updatedGroup = await prisma.contactGroup.update({
      where: { id: groupId },
      data: { name, description }
    });

    res.status(200).json({
      success: true,
      message: 'Contact group updated successfully',
      data: updatedGroup
    });

  } catch (error) {
    console.error('Update contact group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact group'
    });
  }
};

export const deleteContactGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const businessId = req.user.businessId;

    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    await prisma.contactGroup.delete({
      where: { id: groupId }
    });

    res.status(200).json({
      success: true,
      message: 'Contact group deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact group'
    });
  }
};

export const addContactToGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { name, email, phone, dateOfBirth, address } = req.body;
    const businessId = req.user.businessId;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    // Verify group exists and belongs to business
    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    const contact = await prisma.contact.create({
      data: {
        groupId,
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address
      }
    });

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact
    });

  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add contact'
    });
  }
};

export const getContactsInGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, search } = req.query;

    // Verify group exists and belongs to business
    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    const where: any = { groupId };
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } }
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.contact.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

export const updateContact = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, contactId } = req.params;
    const { name, email, phone, dateOfBirth, address } = req.body;
    const businessId = req.user.businessId;

    // Verify group exists and belongs to business
    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        groupId
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address
      }
    });

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, contactId } = req.params;
    const businessId = req.user.businessId;

    // Verify group exists and belongs to business
    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        groupId
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await prisma.contact.delete({
      where: { id: contactId }
    });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};

export const importContacts = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, contacts } = req.body;
    const businessId = req.user.businessId;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        message: 'Contacts must be an array'
      });
    }

    // Verify group exists and belongs to business
    const group = await prisma.contactGroup.findFirst({
      where: {
        id: groupId,
        businessId
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Contact group not found'
      });
    }

    // Validate contacts
    const validContacts = contacts.filter(contact => 
      contact.name && contact.phone
    );

    if (validContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid contacts found'
      });
    }

    // Create contacts
    const createdContacts = await prisma.contact.createMany({
      data: validContacts.map(contact => ({
        groupId,
        name: contact.name,
        email: contact.email || null,
        phone: contact.phone,
        dateOfBirth: contact.dateOfBirth ? new Date(contact.dateOfBirth) : null,
        address: contact.address || null
      }))
    });

    res.status(201).json({
      success: true,
      message: `${createdContacts.count} contacts imported successfully`,
      data: { imported: createdContacts.count }
    });

  } catch (error) {
    console.error('Import contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import contacts'
    });
  }
};