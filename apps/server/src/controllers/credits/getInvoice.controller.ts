// controllers/credits/getInvoice.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { creditService } from '@/services/credit.service';

export const getInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const invoice = await creditService.getInvoice(businessId, id);

    res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    if (error instanceof Error && error.message === 'Invoice not found') {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice'
    });
  }
};