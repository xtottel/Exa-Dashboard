// controllers/sender-id/deleteSenderId.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

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