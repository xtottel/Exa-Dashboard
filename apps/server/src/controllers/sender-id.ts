import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const createSenderId = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const businessId = req.user.businessId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID name is required'
      });
    }

    // Validate sender ID format
    if (name.length < 3 || name.length > 11) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID must be 3-11 characters'
      });
    }

    // if (!/^[a-zA-Z0-9]+$/.test(name)) {
      if (!/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID must be alphanumeric with no spaces or special characters'
      });
    }

    // Check if sender ID already exists for this business
    const existingSenderId = await prisma.senderId.findFirst({
      where: {
        businessId,
        name: name.toUpperCase()
      }
    });

    if (existingSenderId) {
      return res.status(409).json({
        success: false,
        message: 'Sender ID already exists for this business'
      });
    }

    const senderId = await prisma.senderId.create({
      data: {
        businessId,
        name: name.toUpperCase(),
        status: 'pending',
        atWhitelisted: 'Not Submitted'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sender ID submitted for approval',
      data: senderId
    });

  } catch (error) {
    console.error('Create sender ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sender ID'
    });
  }
};

export const getSenderIds = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status } = req.query;

    const where: any = { businessId };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const [senderIds, total] = await Promise.all([
      prisma.senderId.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.senderId.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: senderIds,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get sender IDs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sender IDs'
    });
  }
};

export const updateSenderId = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { atWhitelisted } = req.body;
    const businessId = req.user.businessId;

    const senderId = await prisma.senderId.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!senderId) {
      return res.status(404).json({
        success: false,
        message: 'Sender ID not found'
      });
    }

    // Only allow updating AT whitelisted status
    const updatedSenderId = await prisma.senderId.update({
      where: { id },
      data: { atWhitelisted }
    });

    res.status(200).json({
      success: true,
      message: 'Sender ID updated successfully',
      data: updatedSenderId
    });

  } catch (error) {
    console.error('Update sender ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sender ID'
    });
  }
};


// Add this new function to your sender-id controller
export const verifySenderId = async (req: AuthRequest, res: Response) => {
  try {
    const { senderId } = req.body;
    const businessId = req.user.businessId;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID is required'
      });
    }

    // Check if sender ID exists and is approved for this business
    const validSenderId = await prisma.senderId.findFirst({
      where: {
        id: senderId,
        businessId,
        status: 'approved' // Make sure this matches your database status
      },
      select: {
        id: true,
        name: true,
        status: true,
        atWhitelisted: true
      }
    });

    if (!validSenderId) {
      return res.status(404).json({
        success: false,
        message: 'Sender ID not found or not approved'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sender ID is valid and approved',
      data: validSenderId
    });

  } catch (error) {
    console.error('Verify sender ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify sender ID'
    });
  }
};

export const deleteSenderId = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const senderId = await prisma.senderId.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!senderId) {
      return res.status(404).json({
        success: false,
        message: 'Sender ID not found'
      });
    }

    // Check if sender ID is in use
    const smsCount = await prisma.smsMessage.count({
      where: { senderId: id }
    });

    if (smsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sender ID that is in use'
      });
    }

    await prisma.senderId.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Sender ID deleted successfully'
    });

  } catch (error) {
    console.error('Delete sender ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sender ID'
    });
  }
};