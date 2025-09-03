import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const deleteApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    // Check if API key exists and belongs to the business
    const existingKey = await prisma.apiKey.findFirst({
      where: { id, businessId }
    });

    if (!existingKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    await prisma.apiKey.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete API key'
    });
  }
};