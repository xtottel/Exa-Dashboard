// controllers/sms/bulkSendSMS.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { parentProviderService } from '@/services/parentProvider.service';
import { creditService } from '@/services/credit.service';

const prisma = new PrismaClient();

export const bulkSendSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { recipients, message, senderId, templateId } = req.body;
    const businessId = req.user.businessId;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array and message are required'
      });
    }

    // Validate sender ID
    const validSenderId = await validateSenderId(businessId, senderId);
    if (!validSenderId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sender ID'
      });
    }

    // Calculate total cost
    const totalCost = recipients.reduce((total, recipient) => {
      return total + calculateMessageCost(message);
    }, 0);

    // Check credit balance
    const hasSufficientCredits = await creditService.hasSufficientCredits(businessId, totalCost);
    if (!hasSufficientCredits) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits for bulk send'
      });
    }

    // Create bulk send record
    const bulkSend = await prisma.bulkSend.create({
      data: {
        businessId,
        totalRecipients: recipients.length,
        message,
        senderId: validSenderId.id,
        templateId,
        totalCost,
        status: 'PROCESSING'
      }
    });

    // Process in background (you might want to use a queue system like Bull)
    processBulkSendInBackground(bulkSend.id, recipients, message, validSenderId.name);

    res.status(202).json({
      success: true,
      message: 'Bulk SMS send initiated',
      data: {
        bulkSendId: bulkSend.id,
        totalRecipients: recipients.length,
        estimatedCost: totalCost
      }
    });

  } catch (error) {
    console.error('Bulk send SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate bulk SMS send'
    });
  }
};

async function processBulkSendInBackground(bulkSendId: string, recipients: string[], message: string, senderId: string) {
  try {
    let successful = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        if (!isValidGhanaPhoneNumber(recipient)) {
          failed++;
          continue;
        }

        const messageId = generateMessageId();
        const normalizedPhone = normalizePhoneNumber(recipient);
        const cost = calculateMessageCost(message);

        // Send to parent provider
        const providerResponse = await parentProviderService.sendSMS({
          recipient: normalizedPhone,
          message,
          senderId,
          messageId
        });

        // Create SMS record
        await prisma.smsMessage.create({
          data: {
            businessId: (await prisma.bulkSend.findUnique({ where: { id: bulkSendId } }))!.businessId,
            recipient: normalizedPhone,
            message,
            senderId: (await prisma.senderId.findFirst({ where: { name: senderId } }))!.id,
            type: 'BULK',
            status: providerResponse.success ? 'SENT' : 'FAILED',
            cost,
            messageId,
            externalId: providerResponse.externalId,
            bulkSendId
          }
        });

        if (providerResponse.success) {
          successful++;
        } else {
          failed++;
        }

      } catch (error) {
        console.error(`Failed to send to ${recipient}:`, error);
        failed++;
      }
    }

    // Update bulk send status
    await prisma.bulkSend.update({
      where: { id: bulkSendId },
      data: {
        status: 'COMPLETED',
        successfulCount: successful,
        failedCount: failed
      }
    });

  } catch (error) {
    console.error('Bulk send processing error:', error);
    await prisma.bulkSend.update({
      where: { id: bulkSendId },
      data: { status: 'FAILED' }
    });
  }
}