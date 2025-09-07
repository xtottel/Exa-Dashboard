// controllers/sender-id/getSenderIds.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getSenderIds = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status } = req.query;

    const where: any = { businessId };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const [senderIds, total] = await Promise.all([
      prisma.senderId.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.senderId.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: senderIds,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get sender IDs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sender IDs'
    });
  }
};