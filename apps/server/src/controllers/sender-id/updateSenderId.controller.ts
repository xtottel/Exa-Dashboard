// controllers/sender-id/updateSenderId.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

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