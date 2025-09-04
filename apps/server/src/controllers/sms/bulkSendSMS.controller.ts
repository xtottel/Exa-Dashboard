// controllers/sms/bulkSendSMS.controller.ts
import { Response } from 'express';
import { AccountType, PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { kairosServerService } from '@/services/KairosServer.service';
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
    const hasSufficientCredits = await creditService.hasSufficientCredits(businessId, AccountType.SMS, totalCost);
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

    // Process in background
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

    // Prepare messages for Kairos bulk send
    const kairosMessages = recipients
      .filter(recipient => {
        if (!isValidGhanaPhoneNumber(recipient)) {
          failed++;
          return false;
        }
        return true;
      })
      .map(recipient => {
        const normalizedPhone = normalizePhoneNumber(recipient);
        const messageId = generateMessageId();

        return {
          recipient: normalizedPhone,
          message,
          senderId,
          messageId
        };
      });

    // Send bulk messages to Kairos
    const providerResponses = await kairosServerService.sendBulkSMS(kairosMessages);

    for (let i = 0; i < kairosMessages.length; i++) {
      const msg = kairosMessages[i];
      const providerResponse = providerResponses[i];

      try {
        const cost = calculateMessageCost(message);

        // Create SMS record
        await prisma.smsMessage.create({
          data: {
            businessId: (await prisma.bulkSend.findUnique({ where: { id: bulkSendId } }))!.businessId,
            recipient: msg.recipient,
            message: msg.message,
            senderId: (await prisma.senderId.findFirst({ where: { name: senderId } }))!.id,
            type: 'BULK',
            status: providerResponse.success ? 'SENT' : 'FAILED',
            cost,
            messageId: msg.messageId,
            externalId: providerResponse.externalId,
            bulkSendId
          }
        });

        if (providerResponse.success) {
          successful++;
          
          // Deduct credits for successful sends
          await creditService.deductCredits({
            businessId: (await prisma.bulkSend.findUnique({ where: { id: bulkSendId } }))!.businessId,
            accountType: AccountType.SMS,
            amount: cost,
            description: `Bulk SMS to ${msg.recipient} using ${senderId}`,
            referenceId: bulkSendId
          });
        } else {
          failed++;
        }

      } catch (error) {
        console.error(`Failed to process message for ${msg.recipient}:`, error);
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

// Helper functions (same as in sendSMS.controller.ts)
function isValidGhanaPhoneNumber(phone: string): boolean {
  const ghanaPhoneRegex = /^(?:\+233|0)[234][0-9]{8}$/;
  return ghanaPhoneRegex.test(phone);
}

function normalizePhoneNumber(phone: string): string {
  return phone.replace(/^0/, "233").replace(/^\+233/, "233");
}

function calculateMessageCost(message: string): number {
  const segmentLength = 160;
  const segments = Math.ceil(message.length / segmentLength);
  return segments * 0.03;
}

function generateMessageId(): string {
  return `kairos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function validateSenderId(businessId: string, senderId: string | undefined) {
  if (!senderId) {
    return prisma.senderId.findFirst({
      where: {
        businessId,
        status: "APPROVED",
      },
    });
  }

  return prisma.senderId.findFirst({
    where: {
      id: senderId,
      businessId,
      status: "APPROVED",
    },
  });
}