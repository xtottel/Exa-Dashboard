// controllers/sms/getSMSAnalytics.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getSMSAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { period = '30d', groupBy = 'daily' } = req.query;

    const dateRange = calculateDateRange(period as string);
    
    // Get analytics data grouped by date with Nalo-specific statuses
    const analytics = await prisma.smsMessage.groupBy({
      by: [groupBy === 'daily' ? 'createdAt' : 'status'],
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

    // Get delivery status breakdown
    const statusBreakdown = await prisma.smsMessage.groupBy({
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
      }
    });

    // Format the data for charts
    const formattedData = analytics.map(item => ({
      date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : 'all',
      status: item.status || 'all',
      messages: item._count.id,
      cost: item._sum.cost
    }));

    res.status(200).json({
      success: true,
      data: {
        period: {
          start: dateRange.start,
          end: dateRange.end,
          days: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
        },
        timeline: formattedData.filter(item => item.date !== 'all'),
        statusBreakdown: statusBreakdown.map(item => ({
          status: item.status,
          count: item._count.id,
          percentage: Math.round((item._count.id / statusBreakdown.reduce((total, s) => total + s._count.id, 0)) * 100)
        })),
        totals: {
          messages: statusBreakdown.reduce((total, s) => total + s._count.id, 0),
          cost: formattedData.reduce((total, item) => total + (item.cost || 0), 0)
        }
      }
    });

  } catch (error) {
    console.error('Get SMS analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS analytics'
    });
  }
};

function calculateDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  let start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
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
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
      break;
  }

  return { start, end };
}