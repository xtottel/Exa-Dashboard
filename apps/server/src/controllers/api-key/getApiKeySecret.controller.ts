// controllers/api-key/getApiKeySecret.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getApiKeySecret = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    // This should only be used for newly created keys, not stored ones
    // For security reasons, we cannot retrieve the original secret once hashed
    res.status(400).json({
      success: false,
      message: 'Cannot retrieve secret after creation. Please regenerate if lost.'
    });

  } catch (error) {
    console.error('Get API key secret error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API key secret'
    });
  }
};