// controllers/business/getBusinessProfile.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getBusinessProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          include: {
            settings: true,
            users: {
              include: {
                role: true
              }
            },
            invitations: {
              where: {
                status: 'pending'
              },
              include: {
                invitedBy: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Add full URL to logo and certificate if they exist
    const businessWithFullUrls = {
      ...user.business,
      logo: user.business.logo ? `${process.env.APP_URL || 'https://onclick.sendexa.co'}${user.business.logo}` : null,
      businessCertificate: user.business.businessCertificate ? `${process.env.APP_URL || 'https://onclick.sendexa.co'}${user.business.businessCertificate}` : null
    };

    res.status(200).json({
      success: true,
      message: 'Business profile retrieved successfully',
      business: businessWithFullUrls
    });

  } catch (error) {
    console.error('Get business profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};