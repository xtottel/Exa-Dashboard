
// controllers/api-key/createApiKey.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import crypto from 'crypto';
import { hashPassword } from '@/lib/utils';

const prisma = new PrismaClient();

export const createApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { name, permissions } = req.body;
    const businessId = req.user.businessId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'API key name is required'
      });
    }

    // Generate shorter API key and secret for SMS platform
    const key = `exa_${crypto.randomBytes(8).toString('hex')}`; // 24 chars total
    const secret = crypto.randomBytes(12).toString('hex'); // 32 chars
    
    // Hash the secret for storage
    const hashedSecret = await hashPassword(secret);

    const apiKey = await prisma.apiKey.create({
      data: {
        businessId,
        name,
        key,
        secret: hashedSecret,
        permissions: permissions || ['sms.send', 'sms.read', 'contacts.read'],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    // Return the unhashed secret only once during creation
    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: {
        ...apiKey,
        secret // Return the unhashed secret for one-time display
      }
    });

  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create API key'
    });
  }
};