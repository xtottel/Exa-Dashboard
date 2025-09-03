// controllers/sms/getSMSStats.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getSMSStats = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const dateRange = calculateDateRange(period as string);
    
    // Get stats by status
    const statsByStatus = await prisma.smsMessage.groupBy({
      by: ['status'],
      where: {
        businessId,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        cost: true
      }
    });

    // Get daily stats for timeline
    const dailyStats = await prisma.smsMessage.groupBy({
      by: ['createdAt'],
      where: {
        businessId,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        cost: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get total stats
    const totalStats = await prisma.smsMessage.aggregate({
      where: {
        businessId,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        cost: true
      },
      _avg: {
        cost: true
      }
    });

    // Get top recipients
    const topRecipients = await prisma.smsMessage.groupBy({
      by: ['recipient'],
      where: {
        businessId,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end
        }
      },
      _count: {
        id: true
      },
      _sum: {
        cost: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    res.status(200).json({
      success: true,
      data: {
        period: {
          start: dateRange.start,
          end: dateRange.end,
          days: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
        },
        totals: {
          messages: totalStats._count.id || 0,
          cost: totalStats._sum.cost || 0,
          averageCost: totalStats._avg.cost || 0
        },
        byStatus: statsByStatus,
        timeline: dailyStats.map(day => ({
          date: day.createdAt.toISOString().split('T')[0],
          messages: day._count.id,
          cost: day._sum.cost
        })),
        topRecipients: topRecipients.map(recipient => ({
          recipient: recipient.recipient,
          messages: recipient._count.id,
          cost: recipient._sum.cost
        }))
      }
    });

  } catch (error) {
    console.error('Get SMS stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS statistics'
    });
  }
};

function calculateDateRange(period: string): { start: Date; end: Date } {
  let end = new Date();
  let start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case 'this_month':
      start = new Date(end.getFullYear(), end.getMonth(), 1);
      break;
    case 'last_month':
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end = new Date(end.getFullYear(), end.getMonth(), 0);
      break;
    case 'ytd':
      start = new Date(end.getFullYear(), 0, 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return { start, end };
}