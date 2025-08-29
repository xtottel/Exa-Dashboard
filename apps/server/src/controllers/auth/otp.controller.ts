import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendMail } from '@/utils/mailer';
import OTPEmail from '@/emails/OTPEmail'; // Updated import

const prisma = new PrismaClient();

export const otp = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP type are required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find existing OTP by email and type
    const existingOtp = await prisma.oTP.findFirst({
      where: { email, type }
    });

    if (existingOtp) {
      // Update existing OTP by id
      await prisma.oTP.update({
        where: { id: existingOtp.id },
        data: {
          otp,
          expiresAt: otpExpiry,
          type
        }
      });
    } else {
      // Create new OTP
      await prisma.oTP.create({
        data: {
          email,
          otp,
          expiresAt: otpExpiry,
          type
        }
      });
    }

    // Send OTP via email using the new design
    const name = `${user.firstName} ${user.lastName}`;
    
    await sendMail({
      to: email,
      subject: `Your Verification Code for ${type}`,
      react: OTPEmail({ name, otp, type }),
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};