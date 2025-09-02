// controllers/business/updateBusinessProfile.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const updateBusinessProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      address,
      businessType,
      businessSector,
      description,
      email,
      website,
      logo,
      businessCertificate
    } = req.body;

    // Get user with business
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { business: true }
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Use provided logo/certificate or keep existing
    let logoUrl = user.business.logo;
    let certificateUrl = user.business.businessCertificate;

    if (logo) {
      logoUrl = logo; // directly store string/base64/url in DB
    }

    if (businessCertificate) {
      certificateUrl = businessCertificate;
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: user.businessId },
      data: {
        name,
        phone,
        address,
        businessType,
        businessSector,
        description,
        email,
        website,
        logo: logoUrl,
        businessCertificate: certificateUrl,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      business: updatedBusiness
    });

  } catch (error) {
    console.error('Update business profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
