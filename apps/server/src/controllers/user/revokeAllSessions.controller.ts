// controllers/user/revokeAllSessions.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const revokeAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const currentSessionToken = req.session?.sessionToken;

    await prisma.authSession.updateMany({
      where: {
        userId: userId,
        sessionToken: {
          not: currentSessionToken
        },
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'All other sessions revoked successfully'
    });

  } catch (error) {
    console.error('Revoke all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};