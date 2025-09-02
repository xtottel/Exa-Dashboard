// controllers/business/updateTeamMember.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

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

    // Check if user is trying to update themselves
    if (memberId === user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update your own role'
      });
    }

    // Get the role
    const memberRole = await prisma.role.findFirst({
      where: { name: role }
    });

    if (!memberRole) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Update team member role
    const updatedMember = await prisma.user.update({
      where: { 
        id: memberId,
        businessId: user.businessId // Ensure member belongs to same business
      },
      data: { roleId: memberRole.id },
      include: {
        role: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      member: updatedMember
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};