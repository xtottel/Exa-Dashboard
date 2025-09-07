// controllers/sender-id/verifySenderId.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

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

    // Check if senderId is a UUID (ID) or a name
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(senderId);

    let validSenderId;

    if (isUuid) {
      // Validate by UUID (ID)
      validSenderId = await prisma.senderId.findFirst({
        where: {
          id: senderId,
          businessId,
          status: 'approved'
        },
        select: {
          id: true,
          name: true,
          status: true,
          atWhitelisted: true
        }
      });
    } else {
      // Validate by name
      validSenderId = await prisma.senderId.findFirst({
        where: {
          name: senderId,
          businessId,
          status: 'approved'
        },
        select: {
          id: true,
          name: true,
          status: true,
          atWhitelisted: true
        }
      });
    }

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