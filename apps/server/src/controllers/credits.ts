
// controllers/credits.ts
import { Request, Response } from 'express';
import { PrismaClient, AccountType } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getCreditBalance = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    // Get all account balances
    const accounts = await prisma.businessAccount.findMany({
      where: { businessId },
      orderBy: { type: 'asc' }
    });

    // Ensure all account types exist
    const accountTypes = Object.values(AccountType);
    const balances: Record<string, number> = {};

    for (const type of accountTypes) {
      let account = accounts.find(a => a.type === type);
      
      if (!account) {
        // Create account if it doesn't exist
        account = await prisma.businessAccount.create({
          data: {
            businessId,
            type,
            balance: 0,
            currency: 'GHS'
          }
        });
      }
      
      balances[type] = account.balance;
    }

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

    // Get or create account
    let account = await prisma.businessAccount.findUnique({
      where: {
        businessId_type: {
          businessId,
          type: accountType
        }
      }
    });

    if (!account) {
      account = await prisma.businessAccount.create({
        data: {
          businessId,
          type: accountType,
          balance: 0,
          currency: 'GHS'
        }
      });
    }

    const newBalance = account.balance + amount;

    // Update account balance
    await prisma.businessAccount.update({
      where: { id: account.id },
      data: { balance: newBalance }
    });

    // Create credit transaction
    const transaction = await prisma.creditTransaction.create({
      data: {
        businessId,
        accountId: account.id,
        type: 'PURCHASE',
        amount,
        balance: newBalance,
        description: `Credit purchase via ${paymentMethod || 'unknown'} to ${accountType} account`
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
        type: `${accountType} Credits`,
        description: `Purchase of ${amount} ${accountType} credits`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Credits purchased successfully',
      data: {
        transaction,
        invoice,
        newBalance,
        accountType
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
    const { page = 1, limit = 10, type, accountType } = req.query;

    const where: any = { businessId };
    
    if (type && type !== 'all') {
      where.type = type;
    }

    if (accountType && accountType !== 'all') {
      // Find account ID for the specified type
      const account = await prisma.businessAccount.findFirst({
        where: {
          businessId,
          type: accountType as AccountType
        }
      });
      
      if (account) {
        where.accountId = account.id;
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        include: {
          account: {
            select: {
              type: true
            }
          }
        },
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

    // Get both accounts
    const fromAccount = await prisma.businessAccount.findUnique({
      where: {
        businessId_type: {
          businessId,
          type: fromAccountType
        }
      }
    });

    const toAccount = await prisma.businessAccount.findUnique({
      where: {
        businessId_type: {
          businessId,
          type: toAccountType
        }
      }
    });

    if (!fromAccount || fromAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance in source account'
      });
    }

    if (!toAccount) {
      return res.status(400).json({
        success: false,
        message: 'Destination account not found'
      });
    }

    // Perform transfer in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update from account
      const updatedFromAccount = await tx.businessAccount.update({
        where: { id: fromAccount.id },
        data: { balance: fromAccount.balance - amount }
      });

      // Update to account
      const updatedToAccount = await tx.businessAccount.update({
        where: { id: toAccount.id },
        data: { balance: toAccount.balance + amount }
      });

      // Create transaction records
      const fromTransaction = await tx.creditTransaction.create({
        data: {
          businessId,
          accountId: fromAccount.id,
          type: 'TRANSFER_OUT',
          amount: -amount,
          balance: updatedFromAccount.balance,
          description: description || `Transfer to ${toAccountType} account`
        }
      });

      const toTransaction = await tx.creditTransaction.create({
        data: {
          businessId,
          accountId: toAccount.id,
          type: 'TRANSFER_IN',
          amount,
          balance: updatedToAccount.balance,
          description: description || `Transfer from ${fromAccountType} account`
        }
      });

      return {
        fromAccount: updatedFromAccount,
        toAccount: updatedToAccount,
        fromTransaction,
        toTransaction
      };
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
      message: 'Failed to transfer credits'
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