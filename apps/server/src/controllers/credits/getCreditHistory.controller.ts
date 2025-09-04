// controllers/credits/getCreditHistory.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const getCreditHistory = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, type, accountType } = req.query;

    const result = await creditService.getCreditHistory(businessId, {
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      accountType: accountType as string
    });

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get credit history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit history'
    });
  }
};