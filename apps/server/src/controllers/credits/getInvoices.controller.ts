// controllers/credits/getInvoices.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status } = req.query;

    const result = await creditService.getInvoices(businessId, {
      page: Number(page),
      limit: Number(limit),
      status: status as string
    });

    res.status(200).json({
      success: true,
      data: result.invoices,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};