// controllers/auth/verifyEmail.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) {
      return res.status(404).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    // Update user email verification status
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() }
      });

      // Delete used token
      await tx.verificationToken.delete({
        where: { token }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    // Handle connection errors specifically
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
};