// controllers/sms/sendSMS.controller.ts
import { Response } from "express";
import { PrismaClient, AccountType } from "@prisma/client";
import { AuthRequest } from "@/middleware/auth";
import { kairosServerService } from "@/services/KairosServer.service";
import { creditService } from "@/services/credit.service";

const prisma = new PrismaClient();

export const sendSMS = async (req: AuthRequest, res: Response) => {
  console.log('=== SMS SEND REQUEST STARTED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Business ID:', req.user.businessId);
  
  try {
    const { recipient, message, senderId, templateId } = req.body;
    const businessId = req.user.businessId;
    
    // Validate input
    if (!recipient || !message) {
      console.log('❌ Validation failed: Recipient or message missing');
      return res.status(400).json({
        success: false,
        message: "Recipient and message are required",
      });
    }

    // Validate Ghana phone number
    if (!isValidGhanaPhoneNumber(recipient)) {
      console.log('❌ Validation failed: Invalid Ghana phone number format:', recipient);
      return res.status(400).json({
        success: false,
        message: "Invalid Ghana phone number format. Use format: 0244123456 or +233244123456",
      });
    }

    console.log('✅ Phone number validation passed:', recipient);

    // Validate sender ID belongs to business and is approved
    const validSenderId = await validateSenderId(businessId, senderId);
    if (!validSenderId) {
      console.log('❌ Validation failed: Invalid or unapproved sender ID:', senderId);
      return res.status(400).json({
        success: false,
        message: "Invalid or unapproved sender ID",
      });
    }

    console.log('✅ Sender ID validation passed:', validSenderId.name);

    // Calculate cost based on message segments (in credits)
    const cost = calculateMessageCost(message);
    console.log('📊 Message cost calculation:', {
      messageLength: message.length,
      segments: Math.ceil(message.length / 160),
      cost: cost
    });

    // Check credit balance BEFORE creating the SMS record
    console.log('🔍 Checking credit balance for business:', businessId);
    const hasSufficientCredits = await creditService.hasSufficientCredits(
      businessId,
      AccountType.SMS,
      cost
    );

    if (!hasSufficientCredits) {
      // Get current balance to show user how much they need
      const currentBalance = await creditService.getCurrentBalance(businessId, AccountType.SMS);
      const needed = cost - currentBalance;
      
      console.log('❌ Insufficient credits:', {
        required: cost,
        available: currentBalance,
        needed: needed
      });
      
      return res.status(400).json({
        success: false,
        message: "Insufficient SMS credits",
        data: {
          requiredCredits: cost,
          currentBalance: currentBalance,
          additionalNeeded: needed,
          segments: Math.ceil(message.length / 160)
        },
      });
    }

    console.log('✅ Sufficient credits available:', cost);

    // Create SMS record with pending status
    const normalizedPhone = normalizePhoneNumber(recipient);
    const messageId = generateMessageId();

    console.log('📝 Creating SMS record in database...');
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

    console.log('✅ SMS record created with ID:', smsRecord.id);

    try {
      console.log('📤 Sending to Kairos provider...');
      // Send to Kairos provider
      // const providerResponse = await kairosServerService.sendSMS({
      //   recipient: normalizedPhone,
      //   message,
      //   senderId: validSenderId.name,
      //   messageId,
      // });

      // In the main sendSMS function, after validation:
// After validation, make sure to use validSenderId.name (not .id)
const providerResponse = await kairosServerService.sendSMS({
  recipient: normalizedPhone,
  message,
  senderId: validSenderId.name, // ← This is the critical fix
  messageId,
});

      console.log('📨 Provider response received:', {
        success: providerResponse.success,
        externalId: providerResponse.externalId,
        errorCode: providerResponse.errorCode,
        message: providerResponse.message
      });

      // Handle different provider response scenarios
      let finalStatus = "FAILED";
      let shouldDeductCredits = false;

      if (providerResponse.success) {
        finalStatus = "SENT";
        shouldDeductCredits = true;
        console.log('✅ Provider successfully sent SMS');
      } else if (
        providerResponse.errorCode === "1025" ||
        providerResponse.errorCode === "403"
      ) {
        // Insufficient credit at provider level - don't deduct our credits
        finalStatus = "FAILED_INSUFFICIENT_PROVIDER_CREDIT";
        shouldDeductCredits = false;
        console.log('⚠️ Provider has insufficient credit, not deducting our credits');
      } else if (providerResponse.errorCode === "400") {
        // Invalid parameters - don't deduct credits for bad requests
        finalStatus = "FAILED_INVALID_PARAMETERS";
        shouldDeductCredits = false;
        console.log('⚠️ Invalid parameters, not deducting credits');
      } else {
        // Other errors - deduct credits as the attempt was made
        finalStatus = "FAILED";
        shouldDeductCredits = true;
        console.log('⚠️ Other provider error, deducting credits');
      }

      console.log('📝 Updating SMS record status to:', finalStatus);
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

      console.log('✅ SMS record updated successfully');

      // Deduct credits only if we should
      if (shouldDeductCredits) {
        console.log('💳 Deducting credits from account...');
        const deductionResult = await creditService.deductCredits({
          businessId,
          accountType: AccountType.SMS,
          amount: cost,
          description: `SMS to ${recipient} using ${validSenderId.name}`,
          referenceId: smsRecord.id,
        });
        
        if (deductionResult) {
          console.log('✅ Credits deducted successfully');
        } else {
          console.log('❌ Failed to deduct credits');
        }
      } else {
        console.log('⏭️ Skipping credit deduction');
      }

      // Prepare response based on outcome
      if (providerResponse.success) {
        console.log('🎉 SMS sent successfully, returning success response');
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
        console.log('❌ SMS failed, returning error response');
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
      console.error('🔥 Kairos provider error:', providerError);
      
      // Update SMS status to failed
      console.log('📝 Updating SMS record status to FAILED due to provider error');
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

      console.log('✅ SMS record updated to FAILED status');
      
      res.status(502).json({
        success: false,
        message: "Failed to send SMS through provider. Please try again.",
      });
    }
  } catch (error) {
    console.error('💥 Send SMS error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send SMS",
    });
  } finally {
    console.log('=== SMS SEND REQUEST COMPLETED ===\n');
  }
};

// Helper functions
// function isValidGhanaPhoneNumber(phone: string): boolean {
//   const ghanaPhoneRegex = /^(?:\+233|0)[234][0-9]{8}$/;
//   return ghanaPhoneRegex.test(phone);
// }

function isValidGhanaPhoneNumber(phone: string): boolean {
  // Allow formats: 0244123456, 233244123456, +233244123456, 0551196764
  const ghanaPhoneRegex = /^(?:\+233|233|0)[2345][0-9]{8}$/;
  return ghanaPhoneRegex.test(phone.replace(/\s/g, ''));
}

function normalizePhoneNumber(phone: string): string {
  // Convert to Kairos format (233XXXXXXXXX)
  let normalized = phone.replace(/\s/g, '');
  
  if (normalized.startsWith('0')) {
    return '233' + normalized.substring(1);
  } else if (normalized.startsWith('+233')) {
    return normalized.substring(1);
  } else if (normalized.startsWith('233')) {
    return normalized;
  }
  
  // If it doesn't match expected formats, return as-is (let Kairos validate)
  return normalized;
}
function calculateMessageCost(message: string): number {
  const segmentLength = 160;
  const segments = Math.ceil(message.length / segmentLength);
  // Return number of segments (credits) instead of monetary value
  return segments;
}

function generateMessageId(): string {
  return `kairos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function validateSenderId(
  businessId: string,
  senderId: string | undefined
) {
  console.log('🔍 Validating sender ID:', senderId, 'for business:', businessId);
  
  try {
    let result;
    if (!senderId) {
      // Get default approved sender ID for this business
      result = await prisma.senderId.findFirst({
        where: {
          businessId,
          status: "APPROVED",
        },
        orderBy: { createdAt: 'desc' }, // Get the most recent
      });
    } else {
      // Validate the specific sender ID belongs to this business and is approved
      result = await prisma.senderId.findFirst({
        where: {
          id: senderId,
          businessId,
          status: "APPROVED",
        },
      });
    }
    
    if (!result) {
      console.log('❌ No approved sender ID found');
      return null;
    }
    
    console.log('✅ Sender ID validation passed:', result.name);
    return result;
    
  } catch (error) {
    console.error('Error validating sender ID:', error);
    return null;
  }
}