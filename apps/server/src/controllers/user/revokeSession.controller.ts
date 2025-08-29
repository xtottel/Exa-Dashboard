// controllers/user/revokeSession.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const revokeSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await prisma.authSession.findFirst({
      where: {
        id: sessionId,
        userId: userId
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await prisma.authSession.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};