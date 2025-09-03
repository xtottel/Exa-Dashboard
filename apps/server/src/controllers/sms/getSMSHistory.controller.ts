// controllers/sms/getSMSHistory.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getSMSHistory = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      startDate, 
      endDate,
      senderId 
    } = req.query;

    const where: any = { businessId };
    
    // Apply filters
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (senderId && senderId !== 'all') {
      where.senderId = senderId;
    }
    
    if (search) {
      where.OR = [
        { recipient: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
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

    // Calculate total cost for the filtered results
    const totalCostResult = await prisma.smsMessage.aggregate({
      where,
      _sum: { cost: true }
    });

    res.status(200).json({
      success: true,
      data: smsMessages,
      summary: {
        totalCost: totalCostResult._sum.cost || 0,
        totalMessages: total
      },
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