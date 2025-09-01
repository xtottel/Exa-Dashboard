import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const sendOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { phone, channel = 'SMS' } = req.body;
    const businessId = req.user.businessId;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check credit balance
    const creditBalance = await getCreditBalance(businessId);
    const costPerOTP = 0.05;
    
    if (creditBalance < costPerOTP) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }

    // Create OTP record
    const otp = await prisma.otpMessage.create({
      data: {
        businessId,
        phone,
        code,
        channel,
        status: 'pending',
        codeStatus: 'active',
        cost: costPerOTP,
        expiresAt
      }
    });

    // Deduct credits
    await prisma.creditTransaction.create({
      data: {
        businessId,
        type: 'usage',
        amount: -costPerOTP,
        balance: creditBalance - costPerOTP,
        description: `OTP to ${phone}`
      }
    });

    // TODO: Integrate with actual OTP service

    // Update status to delivered (simulated)
    await prisma.otpMessage.update({
      where: { id: otp.id },
      data: { status: 'delivered' }
    });

    res.status(201).json({
      success: true,
      message: 'OTP sent successfully',
      data: { id: otp.id, code: otp.code }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

export const verifyOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { phone, code } = req.body;
    const businessId = req.user.businessId;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and code are required'
      });
    }

    const otp = await prisma.otpMessage.findFirst({
      where: {
        businessId,
        phone,
        code,
        codeStatus: 'active',
        expiresAt: { gt: new Date() }
      }
    });

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update OTP status to used
    await prisma.otpMessage.update({
      where: { id: otp.id },
      data: { codeStatus: 'used' }
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
};

export const getOTPHistory = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status, search } = req.query;

    const where: any = { businessId };
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { phone: { contains: search as string } },
        { code: { contains: search as string } }
      ];
    }

    const [otpMessages, total] = await Promise.all([
      prisma.otpMessage.findMany({
        where,
        include: {
          sender: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.otpMessage.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: otpMessages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get OTP history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OTP history'
    });
  }
};

export const getOTPStats = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const stats = await prisma.otpAnalytics.findMany({
      where: {
        businessId,
        period: 'daily',
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { date: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get OTP stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OTP statistics'
    });
  }
};

// Helper function to get credit balance
async function getCreditBalance(businessId: string): Promise<number> {
  const latestTransaction = await prisma.creditTransaction.findFirst({
    where: { businessId },
    orderBy: { createdAt: 'desc' }
  });
  
  return latestTransaction?.balance || 0;
}