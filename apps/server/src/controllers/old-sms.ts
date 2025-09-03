import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const sendSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { recipient, message, senderId, templateId } = req.body;
    const businessId = req.user.businessId;

    // Validate input
    if (!recipient || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and message are required'
      });
    }

    // Check credit balance
    const creditBalance = await getCreditBalance(businessId);
    const costPerSMS = 0.05; // Example cost
    
    if (creditBalance < costPerSMS) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }

    // Create SMS record
    const sms = await prisma.smsMessage.create({
      data: {
        businessId,
        recipient,
        message,
        senderId,
        templateId,
        type: 'Outgoing',
        status: 'pending',
        cost: costPerSMS
      }
    });

    // Deduct credits
    await prisma.creditTransaction.create({
      data: {
        businessId,
        type: 'usage',
        amount: -costPerSMS,
        balance: creditBalance - costPerSMS,
        description: `SMS to ${recipient}`
      }
    });

    // TODO: Integrate with actual SMS gateway here

    // Update status to delivered (simulated)
    await prisma.smsMessage.update({
      where: { id: sms.id },
      data: { status: 'delivered' }
    });

    res.status(201).json({
      success: true,
      message: 'SMS sent successfully',
      data: sms
    });

  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS'
    });
  }
};

export const getSMSHistory = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status, search } = req.query;

    const where: any = { businessId };
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { recipient: { contains: search as string } },
        { message: { contains: search as string } }
      ];
    }

    const [smsMessages, total] = await Promise.all([
      prisma.smsMessage.findMany({
        where,
        include: {
          sender: true,
          template: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.smsMessage.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: smsMessages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get SMS history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS history'
    });
  }
};

export const getSMSDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const sms = await prisma.smsMessage.findFirst({
      where: {
        id,
        businessId
      },
      include: {
        sender: true,
        template: true
      }
    });

    if (!sms) {
      return res.status(404).json({
        success: false,
        message: 'SMS not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sms
    });

  } catch (error) {
    console.error('Get SMS details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS details'
    });
  }
};

export const getSMSStats = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { period = '30d' } = req.query;

    const stats = await prisma.smsAnalytics.findMany({
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
    console.error('Get SMS stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS statistics'
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