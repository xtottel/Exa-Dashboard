// controllers/sms/sendSMS.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "@/middleware/auth";
import { parentProviderService } from "@/services/parentProvider.service";
import { creditService } from "@/services/credit.service";
import { AccountType } from "@prisma/client";

const prisma = new PrismaClient();

export const sendSMS = async (req: AuthRequest, res: Response) => {
  try {
    const { recipient, message, senderId, templateId } = req.body;
    const businessId = req.user.businessId;

    // Validate input
    if (!recipient || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient and message are required",
      });
    }

    // Validate Ghana phone number
    if (!isValidGhanaPhoneNumber(recipient)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Ghana phone number format. Use format: 0244123456 or +233244123456",
      });
    }

    // Validate sender ID belongs to business and is approved
    const validSenderId = await validateSenderId(businessId, senderId);
    if (!validSenderId) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unapproved sender ID",
      });
    }

    // Calculate cost based on message segments
    const cost = calculateMessageCost(message);

    // In the sendSMS function, update the credit checks:

    // Check credit balance in SMS account
    const hasSufficientCredits = await creditService.hasSufficientCredits(
      businessId,
      AccountType.SMS,
      cost
    );

    // Create SMS record with pending status
    const normalizedPhone = normalizePhoneNumber(recipient);
    const messageId = generateMessageId();

    const smsRecord = await prisma.smsMessage.create({
      data: {
        businessId,
        recipient: normalizedPhone,
        message,
        senderId: validSenderId.id,
        templateId,
        type: "OUTGOING",
        status: "PENDING",
        cost,
        messageId,
      },
    });

    try {
      // Send to Nalo provider
      const providerResponse = await parentProviderService.sendSMS({
        recipient: normalizedPhone,
        message,
        senderId: validSenderId.name,
        messageId,
      });

      // Handle different provider response scenarios
      let finalStatus = "FAILED";
      let shouldDeductCredits = false;

      if (providerResponse.success) {
        finalStatus = "SENT";
        shouldDeductCredits = true;
      } else if (
        providerResponse.errorCode === "1025" ||
        providerResponse.errorCode === "1026"
      ) {
        // Insufficient credit at provider level - don't deduct our credits
        finalStatus = "FAILED_INSUFFICIENT_PROVIDER_CREDIT";
        shouldDeductCredits = false;
      } else if (providerResponse.errorCode === "1706") {
        // Invalid destination - don't deduct credits for bad numbers
        finalStatus = "FAILED_INVALID_DESTINATION";
        shouldDeductCredits = false;
      } else {
        // Other errors - deduct credits as the attempt was made
        finalStatus = "FAILED";
        shouldDeductCredits = true;
      }

      // Update SMS record
      await prisma.smsMessage.update({
        where: { id: smsRecord.id },
        data: {
          status: finalStatus,
          externalId: providerResponse.externalId,
          errorCode: providerResponse.errorCode,
          errorMessage: providerResponse.message,
        },
      });

      // After successful send, deduct from SMS account
      await creditService.deductCredits({
        businessId,
        accountType: AccountType.SMS,
        amount: cost,
        description: `SMS to ${recipient} using ${validSenderId.name}`,
        referenceId: smsRecord.id,
      });
      // Prepare response based on outcome
      if (providerResponse.success) {
        res.status(201).json({
          success: true,
          message: "SMS sent successfully",
          data: {
            id: smsRecord.id,
            messageId: smsRecord.messageId,
            externalId: providerResponse.externalId,
            status: finalStatus,
            cost,
            recipient: normalizedPhone,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: providerResponse.message || "Failed to send SMS",
          errorCode: providerResponse.errorCode,
          data: {
            id: smsRecord.id,
            status: finalStatus,
            error: providerResponse.message,
          },
        });
      }
    } catch (providerError) {
      // Update SMS status to failed
      await prisma.smsMessage.update({
        where: { id: smsRecord.id },
        data: {
          status: "FAILED",
          errorMessage:
            providerError instanceof Error
              ? providerError.message
              : "Unknown provider error",
        },
      });

      console.error("Nalo provider error:", providerError);
      res.status(502).json({
        success: false,
        message: "Failed to send SMS through provider. Please try again.",
      });
    }
  } catch (error) {
    console.error("Send SMS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send SMS",
    });
  }
};

// Helper functions (same as before)
function isValidGhanaPhoneNumber(phone: string): boolean {
  const ghanaPhoneRegex = /^(?:\+233|0)[234][0-9]{8}$/;
  return ghanaPhoneRegex.test(phone);
}

function normalizePhoneNumber(phone: string): string {
  // Convert to Nalo format (233XXXXXXXXX)
  return phone.replace(/^0/, "233").replace(/^\+233/, "233");
}

function calculateMessageCost(message: string): number {
  const segmentLength = 160;
  const segments = Math.ceil(message.length / segmentLength);
  // Adjust this based on your actual cost per segment from Nalo
  return segments * 0.05;
}

function generateMessageId(): string {
  return `exa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function validateSenderId(
  businessId: string,
  senderId: string | undefined
) {
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
