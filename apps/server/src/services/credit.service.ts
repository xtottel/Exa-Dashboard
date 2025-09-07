
// services/credit.service.ts
import { PrismaClient, AccountType, CreditTransaction } from '@prisma/client';
import { logger } from '@/utils/logger';

interface CreditDeductionOptions {
  businessId: string;
  accountType: AccountType;
  amount: number;
  description: string;
  referenceId?: string;
}

interface PurchaseCreditsOptions {
  businessId: string;
  accountType: AccountType;
  amount: number;
  paymentMethod: string;
  description?: string;
}

interface TransferCreditsOptions {
  businessId: string;
  fromAccountType: AccountType;
  toAccountType: AccountType;
  amount: number;
  description?: string;
}

class CreditService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get or create business account with proper error handling
   */
  private async getOrCreateAccount(businessId: string, type: AccountType) {
    try {
      let account = await this.prisma.businessAccount.findUnique({
        where: {
          businessId_type: {
            businessId,
            type
          }
        }
      });

      if (!account) {
        account = await this.prisma.businessAccount.create({
          data: {
            businessId,
            type,
            balance: 0,
            currency: 'CREDITS'
          }
        });
        logger.info(`Created new account for business ${businessId}, type: ${type}`);
      }

      return account;
    } catch (error) {
      logger.error('Error getting/creating account:', error);
      throw new Error(`Failed to get/create account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if business has sufficient credits in specific account
   */
  async hasSufficientCredits(
    businessId: string, 
    accountType: AccountType, 
    amount: number
  ): Promise<boolean> {
    try {
      const account = await this.getOrCreateAccount(businessId, accountType);
      const hasSufficient = account.balance >= amount;
      
      logger.debug(`Credit check - Business: ${businessId}, Account: ${accountType}, Required: ${amount}, Available: ${account.balance}, Sufficient: ${hasSufficient}`);
      
      return hasSufficient;
    } catch (error) {
      logger.error('Credit check error:', error);
      return false;
    }
  }

  /**
   * Get current credit balance for specific account
   */
  async getCurrentBalance(businessId: string, accountType: AccountType): Promise<number> {
    try {
      const account = await this.getOrCreateAccount(businessId, accountType);
      logger.debug(`Balance retrieved - Business: ${businessId}, Account: ${accountType}, Balance: ${account.balance}`);
      return account.balance;
    } catch (error) {
      logger.error('Balance retrieval error:', error);
      return 0;
    }
  }

  /**
   * Get all account balances for business with proper error handling
   */
  async getAllBalances(businessId: string) {
    try {
      const accounts = await this.prisma.businessAccount.findMany({
        where: { businessId },
        orderBy: { type: 'asc' }
      });

      // Ensure both account types exist
      const accountTypes = [AccountType.SMS, AccountType.WALLET];
      const result: Record<string, number> = {};

      for (const type of accountTypes) {
        const account = accounts.find(a => a.type === type) || 
          await this.getOrCreateAccount(businessId, type);
        result[type] = account.balance;
      }

      logger.debug(`Retrieved all balances for business ${businessId}: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error('Error getting all balances:', error);
      throw error;
    }
  }

  /**
   * Purchase credits with invoice creation
   */
  async purchaseCredits(options: PurchaseCreditsOptions) {
    const { businessId, accountType, amount, paymentMethod, description } = options;

    try {
      return await this.prisma.$transaction(async (tx) => {
        logger.info(`Purchasing credits - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}`);

        const account = await this.getOrCreateAccount(businessId, accountType);
        const newBalance = account.balance + amount;

        // Update account balance
        await tx.businessAccount.update({
          where: { id: account.id },
          data: { balance: newBalance }
        });

        // Create credit transaction
        const transaction = await tx.creditTransaction.create({
          data: {
            businessId,
            accountId: account.id,
            type: 'PURCHASE',
            amount,
            balance: newBalance,
            description: description || `Credit purchase via ${paymentMethod} to ${accountType} account`
          }
        });

        // Create invoice
        const invoiceId = `INV-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const invoice = await tx.invoice.create({
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

        logger.info(`Credit purchase successful - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}, New Balance: ${newBalance}`);
        
        return { transaction, invoice, newBalance, accountType };
      });
    } catch (error) {
      logger.error('Credit purchase error:', error);
      throw error;
    }
  }

  /**
   * Transfer credits between accounts
   */
  async transferCredits(options: TransferCreditsOptions) {
    const { businessId, fromAccountType, toAccountType, amount, description } = options;

    try {
      return await this.prisma.$transaction(async (tx) => {
        logger.info(`Transferring credits - Business: ${businessId}, From: ${fromAccountType}, To: ${toAccountType}, Amount: ${amount}`);

        // Get both accounts
        const fromAccount = await tx.businessAccount.findUnique({
          where: {
            businessId_type: {
              businessId,
              type: fromAccountType
            }
          }
        });

        const toAccount = await tx.businessAccount.findUnique({
          where: {
            businessId_type: {
              businessId,
              type: toAccountType
            }
          }
        });

        if (!fromAccount || fromAccount.balance < amount) {
          throw new Error('Insufficient balance in source account');
        }

        if (!toAccount) {
          throw new Error('Destination account not found');
        }

        // Update accounts
        const updatedFromAccount = await tx.businessAccount.update({
          where: { id: fromAccount.id },
          data: { balance: fromAccount.balance - amount }
        });

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

        logger.info(`Credit transfer successful - Business: ${businessId}, From: ${fromAccountType}, To: ${toAccountType}, Amount: ${amount}`);
        
        return {
          fromAccount: updatedFromAccount,
          toAccount: updatedToAccount,
          fromTransaction,
          toTransaction
        };
      });
    } catch (error) {
      logger.error('Credit transfer error:', error);
      throw error;
    }
  }

  /**
   * Get credit history with pagination
   */
  async getCreditHistory(businessId: string, filters: {
    page?: number;
    limit?: number;
    type?: string;
    accountType?: string;
  }) {
    try {
      const { page = 1, limit = 10, type, accountType } = filters;

      const where: any = { businessId };
      
      if (type && type !== 'all') {
        where.type = type as unknown as CreditTransaction;
      }

      if (accountType && accountType !== 'all') {
        const account = await this.prisma.businessAccount.findFirst({
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
        this.prisma.creditTransaction.findMany({
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
        this.prisma.creditTransaction.count({ where })
      ]);

      return {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      };
    } catch (error) {
      logger.error('Error getting credit history:', error);
      throw error;
    }
  }

  /**
   * Get invoices with pagination
   */
  async getInvoices(businessId: string, filters: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    try {
      const { page = 1, limit = 10, status } = filters;

      const where: any = { businessId };
      
      if (status && status !== 'all') {
        where.status = status;
      }

      const [invoices, total] = await Promise.all([
        this.prisma.invoice.findMany({
          where,
          orderBy: { date: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        this.prisma.invoice.count({ where })
      ]);

      return {
        invoices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      };
    } catch (error) {
      logger.error('Error getting invoices:', error);
      throw error;
    }
  }

  /**
   * Get single invoice
   */
  async getInvoice(businessId: string, invoiceId: string) {
    try {
      const invoice = await this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          businessId
        }
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return invoice;
    } catch (error) {
      logger.error('Error getting invoice:', error);
      throw error;
    }
  }

  /**
   * Deduct credits from specific account with better error handling
   */
  async deductCredits(options: CreditDeductionOptions): Promise<boolean> {
    const { businessId, accountType, amount, description, referenceId } = options;

    try {
      return await this.prisma.$transaction(async (tx) => {
        logger.info(`Starting credit deduction - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}`);

        const account = await tx.businessAccount.findUnique({
          where: {
            businessId_type: {
              businessId,
              type: accountType
            }
          }
        });

        if (!account) {
          throw new Error(`Account not found for business ${businessId}, type ${accountType}`);
        }

        if (account.balance < amount) {
          logger.warn(`Insufficient credits - Business: ${businessId}, Account: ${accountType}, Required: ${amount}, Available: ${account.balance}`);
          throw new Error('Insufficient credits');
        }

        const newBalance = account.balance - amount;

        // Update account balance
        await tx.businessAccount.update({
          where: { id: account.id },
          data: { balance: newBalance }
        });

        // Create transaction record
        await tx.creditTransaction.create({
          data: {
            businessId,
            accountId: account.id,
            type: 'USAGE',
            amount: -amount,
            balance: newBalance,
            description,
            referenceId
          }
        });

        logger.info(`Credit deduction successful - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}, New Balance: ${newBalance}`);
        return true;
      });
    } catch (error) {
      logger.error('Credit deduction error:', error);
      return false;
    }
  }

  /**
   * Add credits to specific account with logging
   */
  async addCredits(
    businessId: string, 
    accountType: AccountType,
    amount: number, 
    description: string, 
    referenceId?: string
  ): Promise<boolean> {
    try {
      logger.info(`Adding credits - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}`);

      const account = await this.getOrCreateAccount(businessId, accountType);
      const newBalance = account.balance + amount;

      // Update account balance
      await this.prisma.businessAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      });

      // Create transaction record
      await this.prisma.creditTransaction.create({
        data: {
          businessId,
          accountId: account.id,
          type: 'PURCHASE',
          amount,
          balance: newBalance,
          description,
          referenceId
        }
      });

      logger.info(`Credit addition successful - Business: ${businessId}, Account: ${accountType}, Amount: ${amount}, New Balance: ${newBalance}`);
      return true;
    } catch (error) {
      logger.error('Credit addition error:', error);
      return false;
    }
  }
}

export const creditService = new CreditService();
export { AccountType };