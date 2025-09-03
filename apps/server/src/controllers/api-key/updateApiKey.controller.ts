import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import crypto from 'crypto';
import { hashPassword } from '@/lib/utils';

const prisma = new PrismaClient();

export const updateApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isActive, regenerateSecret } = req.body;
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

    let updateData: any = {};
    let newSecret: string | undefined;

    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Regenerate secret if requested
    if (regenerateSecret) {
      const secret = crypto.randomBytes(32).toString('hex');
      newSecret = secret;
      updateData.secret = await hashPassword(secret);
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'API key updated successfully',
      data: {
        ...updatedKey,
        secret: newSecret // Return new secret only if regenerated
      }
    });

  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update API key'
    });
  }
};