import { Request, Response } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '@/utils/mailer';
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail';

const prisma = new PrismaClient();

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Find existing reset token for this user
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id }
    });

    if (existingToken) {
      await prisma.passwordResetToken.update({
        where: { id: existingToken.id },
        data: {
          token: resetToken,
          expiresAt: resetExpiry
        }
      });
    } else {
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          expiresAt: resetExpiry,
          userId: user.id
        }
      });
    }

    // Send reset email using the same pattern as signup
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const name = `${user.firstName} ${user.lastName}`;
    
    await sendMail({
      to: email,
      subject: 'Reset Your Password',
      react: ResetPasswordEmail({ name, url: resetUrl }),
    });

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};