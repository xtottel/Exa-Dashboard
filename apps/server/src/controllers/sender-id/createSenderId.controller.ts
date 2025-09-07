// controllers/sender-id/createSenderId.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const createSenderId = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const businessId = req.user.businessId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID name is required'
      });
    }

    // Validate sender ID format - allow spaces but check total length
    if (name.length < 3 || name.length > 11) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID must be 3-11 characters (including spaces)'
      });
    }

    // Allow letters and spaces only
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID must contain only letters and spaces'
      });
    }

    // Check if sender ID already exists for this business (case-sensitive)
    const existingSenderId = await prisma.senderId.findFirst({
      where: {
        businessId,
        name: name // Store as provided (case-sensitive)
      }
    });

    if (existingSenderId) {
      return res.status(409).json({
        success: false,
        message: 'Sender ID already exists for this business'
      });
    }

    const senderId = await prisma.senderId.create({
      data: {
        businessId,
        name: name, // Store as provided (preserves case and spaces)
        status: 'pending',
        atWhitelisted: 'Not Submitted'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sender ID submitted for approval',
      data: senderId
    });

  } catch (error) {
    console.error('Create sender ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sender ID'
    });
  }
};