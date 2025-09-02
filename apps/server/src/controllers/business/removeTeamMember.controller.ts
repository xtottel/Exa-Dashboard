// controllers/business/removeTeamMember.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;

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

    // Check if user is trying to remove themselves
    if (memberId === user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove yourself from the team'
      });
    }

    // Remove team member
    await prisma.user.delete({
      where: { 
        id: memberId,
        businessId: user.businessId // Ensure member belongs to same business
      }
    });

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};