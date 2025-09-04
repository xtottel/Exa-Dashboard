// controllers/credits/getCreditBalance.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const getCreditBalance = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const balances = await creditService.getAllBalances(businessId);

    res.status(200).json({
      success: true,
      data: { balances }
    });

  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit balance'
    });
  }
};