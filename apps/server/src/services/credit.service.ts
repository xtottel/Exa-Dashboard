
// services/credit.service.ts
import { PrismaClient, AccountType } from '@prisma/client';

interface CreditDeductionOptions {
  businessId: string;
  accountType: AccountType;
  amount: number;
  description: string;
  referenceId?: string;
}

class CreditService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get or create business account
   */
  private async getOrCreateAccount(businessId: string, type: AccountType) {
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
          currency: 'GHS'
        }
      });
    }

    return account;
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
      return account.balance >= amount;
    } catch (error) {
      console.error('Credit check error:', error);
      return false;
    }
  }

  /**
   * Get current credit balance for specific account
   */
  async getCurrentBalance(businessId: string, accountType: AccountType): Promise<number> {
    try {
      const account = await this.getOrCreateAccount(businessId, accountType);
      return account.balance;
    } catch (error) {
      console.error('Balance retrieval error:', error);
      return 0;
    }
  }

  /**
   * Deduct credits from specific account
   */
  async deductCredits(options: CreditDeductionOptions): Promise<boolean> {
    const { businessId, accountType, amount, description, referenceId } = options;

    return this.prisma.$transaction(async (tx) => {
      try {
        const account = await tx.businessAccount.findUnique({
          where: {
            businessId_type: {
              businessId,
              type: accountType
            }
          }
        });

        if (!account || account.balance < amount) {
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

        return true;
      } catch (error) {
        console.error('Credit deduction error:', error);
        return false;
      }
    });
  }

  /**
   * Add credits to specific account
   */
  async addCredits(
    businessId: string, 
    accountType: AccountType,
    amount: number, 
    description: string, 
    referenceId?: string
  ): Promise<boolean> {
    try {
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

      return true;
    } catch (error) {
      console.error('Credit addition error:', error);
      return false;
    }
  }

  /**
   * Transfer credits between accounts
   */
  async transferCredits(
    businessId: string,
    fromAccountType: AccountType,
    toAccountType: AccountType,
    amount: number,
    description: string
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      try {
        const fromAccount = await tx.businessAccount.findUnique({
          where: {
            businessId_type: {
              businessId,
              type: fromAccountType
            }
          }
        });

        const toAccount = await this.getOrCreateAccount(businessId, toAccountType);

        if (!fromAccount || fromAccount.balance < amount) {
          throw new Error('Insufficient credits in source account');
        }

        const fromNewBalance = fromAccount.balance - amount;
        const toNewBalance = toAccount.balance + amount;

        // Update both accounts
        await tx.businessAccount.update({
          where: { id: fromAccount.id },
          data: { balance: fromNewBalance }
        });

        await tx.businessAccount.update({
          where: { id: toAccount.id },
          data: { balance: toNewBalance }
        });

        // Create transaction records
        await tx.creditTransaction.create({
          data: {
            businessId,
            accountId: fromAccount.id,
            type: 'TRANSFER_OUT',
            amount: -amount,
            balance: fromNewBalance,
            description: `Transfer to ${toAccountType} account: ${description}`
          }
        });

        await tx.creditTransaction.create({
          data: {
            businessId,
            accountId: toAccount.id,
            type: 'TRANSFER_IN',
            amount,
            balance: toNewBalance,
            description: `Transfer from ${fromAccountType} account: ${description}`
          }
        });

        return true;
      } catch (error) {
        console.error('Credit transfer error:', error);
        return false;
      }
    });
  }

  /**
   * Get all account balances for business
   */
  async getAllBalances(businessId: string) {
    const accounts = await this.prisma.businessAccount.findMany({
      where: { businessId },
      orderBy: { type: 'asc' }
    });

    // Ensure all account types exist
    const accountTypes = Object.values(AccountType);
    const result: Record<string, number> = {};

    for (const type of accountTypes) {
      const account = accounts.find(a => a.type === type) || 
        await this.getOrCreateAccount(businessId, type);
      result[type] = account.balance;
    }

    return result;
  }
}

export const creditService = new CreditService();
export { AccountType };