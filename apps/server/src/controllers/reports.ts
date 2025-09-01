import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const getSMSReports = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { startDate, endDate, status } = req.query;

    const where: any = { businessId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const reports = await prisma.smsMessage.findMany({
      where,
      include: {
        sender: true,
        template: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Get SMS reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SMS reports'
    });
  }
};

export const getOTPReports = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { startDate, endDate, status } = req.query;

    const where: any = { businessId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const reports = await prisma.otpMessage.findMany({
      where,
      include: {
        sender: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Get OTP reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OTP reports'
    });
  }
};

export const getNetworkDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { period = '30d' } = req.query;

    const distribution = await prisma.networkDistribution.findMany({
      where: {
        businessId,
        period: 'daily',
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { date: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: distribution
    });

  } catch (error) {
    console.error('Get network distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch network distribution'
    });
  }
};

export const exportReports = async (req: AuthRequest, res: Response) => {
  try {
    const { type, format = 'csv', startDate, endDate } = req.body;
    const businessId = req.user.businessId;

    let data: any[] = [];
    let filename = '';

    const where: any = { businessId };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    switch (type) {
      case 'sms':
        data = await prisma.smsMessage.findMany({
          where,
          include: { sender: true, template: true }
        });
        filename = `sms-reports-${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'otp':
        data = await prisma.otpMessage.findMany({
          where,
          include: { sender: true }
        });
        filename = `otp-reports-${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'credits':
        data = await prisma.creditTransaction.findMany({ where });
        filename = `credit-history-${new Date().toISOString().split('T')[0]}`;
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Convert to CSV (simplified)
    if (format === 'csv') {
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csv);
    }

    // Default to JSON
    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export reports'
    });
  }
};

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
}