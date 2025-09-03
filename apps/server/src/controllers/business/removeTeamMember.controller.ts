// // controllers/business/removeTeamMember.controller.ts
// import { Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { AuthRequest } from '@/middleware/auth';

// const prisma = new PrismaClient();

// export const removeTeamMember = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user.id;
//     const { memberId } = req.params;

//     // Get user's business
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: { business: true }
//     });

//     if (!user || !user.business) {
//       return res.status(404).json({
//         success: false,
//         message: 'Business not found'
//       });
//     }

//     // Check if user is trying to remove themselves
//     if (memberId === user.id) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot remove yourself from the team'
//       });
//     }

//     // Remove team member
//     await prisma.user.delete({
//       where: { 
//         id: memberId,
//         businessId: user.businessId // Ensure member belongs to same business
//       }
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Team member removed successfully'
//     });

//   } catch (error) {
//     console.error('Remove team member error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

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
      include: { business: true, role: true }
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if user has permission to remove members (admin or owner)
    if (user.role?.name !== 'owner' && user.role?.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to remove team members'
      });
    }

    // Check if user is trying to remove themselves
    if (memberId === user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove yourself from the team'
      });
    }

    // Get the member to be removed
    const memberToRemove = await prisma.user.findUnique({
      where: { id: memberId },
      include: { role: true }
    });

    if (!memberToRemove) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Check if member belongs to the same business
    if (memberToRemove.businessId !== user.businessId) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found in your business'
      });
    }

    // Prevent removing owners (only owners can remove other owners)
    if (memberToRemove.role?.name === 'owner' && user.role?.name !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can remove other owners'
      });
    }

    // Remove team member
    await prisma.user.delete({
      where: { 
        id: memberId
      }
    });

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    
    // Handle specific Prisma errors
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};