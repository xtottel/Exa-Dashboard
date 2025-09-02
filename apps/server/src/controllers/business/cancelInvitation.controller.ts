// controllers/business/cancelInvitation.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const cancelInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { invitationId } = req.params;

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { business: true }
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Cancel invitation
    await prisma.invitation.update({
      where: { 
        id: invitationId,
        businessId: user.businessId, // Ensure invitation belongs to same business
        status: 'pending'
      },
      data: { 
        status: 'canceled',
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Invitation canceled successfully'
    });

  } catch (error) {
    console.error('Cancel invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};