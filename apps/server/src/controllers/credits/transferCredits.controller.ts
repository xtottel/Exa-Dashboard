// controllers/credits/transferCredits.controller.ts
import { Response } from 'express';
import { AccountType } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const transferCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { fromAccountType, toAccountType, amount, description } = req.body;
    const businessId = req.user.businessId;

    if (!fromAccountType || !toAccountType || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid fromAccountType, toAccountType, and amount are required'
      });
    }

    if (fromAccountType === toAccountType) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to the same account type'
      });
    }

    const result = await creditService.transferCredits({
      businessId,
      fromAccountType,
      toAccountType,
      amount,
      description
    });

    res.status(200).json({
      success: true,
      message: 'Credits transferred successfully',
      data: result
    });

  } catch (error) {
    console.error('Transfer credits error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to transfer credits'
    });
  }
};