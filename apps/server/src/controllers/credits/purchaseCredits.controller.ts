// controllers/credits/purchaseCredits.controller.ts
import { Response } from 'express';
import { AccountType } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const purchaseCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, paymentMethod, accountType = AccountType.SMS } = req.body;
    const businessId = req.user.businessId;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Validate account type
    if (![AccountType.SMS, AccountType.WALLET].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account type. Must be SMS or WALLET'
      });
    }

    const result = await creditService.purchaseCredits({
      businessId,
      accountType,
      amount,
      paymentMethod
    });

    res.status(201).json({
      success: true,
      message: 'Credits purchased successfully',
      data: result
    });

  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to purchase credits'
    });
  }
};