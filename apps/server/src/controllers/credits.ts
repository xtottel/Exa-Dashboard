import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getCreditBalance = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const latestTransaction = await prisma.creditTransaction.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    const balance = latestTransaction?.balance || 0;

    res.status(200).json({
      success: true,
      data: { balance }
    });

  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit balance'
    });
  }
};

export const purchaseCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, paymentMethod } = req.body;
    const businessId = req.user.businessId;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Get current balance
    const latestTransaction = await prisma.creditTransaction.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    const currentBalance = latestTransaction?.balance || 0;
    const newBalance = currentBalance + amount;

    // Create credit transaction
    const transaction = await prisma.creditTransaction.create({
      data: {
        businessId,
        type: 'purchase',
        amount,
        balance: newBalance,
        description: `Credit purchase via ${paymentMethod || 'unknown'}`
      }
    });

    // Create invoice
    const invoiceId = `INV-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const invoice = await prisma.invoice.create({
      data: {
        businessId,
        invoiceId,
        date: new Date(),
        amount,
        status: 'paid',
        type: 'SMS Credits',
        description: `Purchase of ${amount} SMS credits`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Credits purchased successfully',
      data: {
        transaction,
        invoice,
        newBalance
      }
    });

  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase credits'
    });
  }
};

export const getCreditHistory = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, type } = req.query;

    const where: any = { businessId };
    
    if (type && type !== 'all') {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.creditTransaction.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get credit history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit history'
    });
  }
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, status } = req.query;

    const where: any = { businessId };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.invoice.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: invoices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

export const getInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice'
    });
  }
};