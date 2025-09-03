import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getApiKeys = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const apiKeys = await prisma.apiKey.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        key: true,
        permissions: true,
        expiresAt: true,
        createdAt: true,
        lastUsedAt: true,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      message: 'API keys retrieved successfully',
      data: apiKeys
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API keys'
    });
  }
};