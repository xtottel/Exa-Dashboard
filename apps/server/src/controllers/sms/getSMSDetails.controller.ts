// controllers/sms/getSMSDetails.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { kairosServerService } from '@/services/KairosServer.service';

const prisma = new PrismaClient();

export const getSMSDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const sms = await prisma.smsMessage.findFirst({
      where: {
        id,
        businessId
      },
      include: {
        sender: true,
        template: true,
        business: {
          select: {
            name: true,
            phone: true
          }
        },
        bulkSend: {
          select: {
            id: true,
            totalRecipients: true,
            successfulCount: true,
            failedCount: true
          }
        }
      }
    });

    if (!sms) {
      return res.status(404).json({
        success: false,
        message: 'SMS not found'
      });
    }

    // Get delivery status from Kairos if available
    let deliveryStatus = null;
    if (sms.externalId) {
      try {
        deliveryStatus = await kairosServerService.getDeliveryStatus(sms.externalId);
      } catch (error) {
        console.error('Failed to get delivery status from Kairos:', error);
      }
    }

    // Calculate message segments
    const segments = Math.ceil(sms.message.length / 160);
    const characters = sms.message.length;

    res.status(200).json({
      success: true,
      data: {
        ...sms,
        deliveryStatus,
        analytics: {
          segments,
          characters,
          costPerSegment: sms.cost / segments
        }
      }
    });

  } catch (error) {
    console.error('Get SMS details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS details'
    });
  }
};