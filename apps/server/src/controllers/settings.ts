import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const getBusinessSettings = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const settings = await prisma.businessSettings.findFirst({
      where: { businessId }
    });

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Get business settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business settings'
    });
  }
};

export const updateBusinessSettings = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { securityLevel, mfaRequired, sessionTimeout, maxLoginAttempts } = req.body;

    const settings = await prisma.businessSettings.findFirst({
      where: { businessId }
    });

    let updatedSettings;
    
    if (settings) {
      updatedSettings = await prisma.businessSettings.update({
        where: { id: settings.id },
        data: {
          securityLevel,
          mfaRequired,
          sessionTimeout,
          maxLoginAttempts
        }
      });
    } else {
      updatedSettings = await prisma.businessSettings.create({
        data: {
          businessId,
          securityLevel,
          mfaRequired,
          sessionTimeout,
          maxLoginAttempts
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully',
      data: updatedSettings
    });

  } catch (error) {
    console.error('Update business settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business settings'
    });
  }
};

export const getApiKeys = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const apiKeys = await prisma.apiKey.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: apiKeys
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API keys'
    });
  }
};

export const createApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { name, permissions } = req.body;
    const businessId = req.user.businessId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'API key name is required'
      });
    }

    const key = crypto.randomBytes(32).toString('hex');
    const secret = crypto.randomBytes(64).toString('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        businessId,
        name,
        key,
        secret,
        permissions: permissions || [],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: apiKey
    });

  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create API key'
    });
  }
};

export const updateApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, permissions, isActive } = req.body;
    const businessId = req.user.businessId;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: { id },
      data: {
        name,
        permissions,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'API key updated successfully',
      data: updatedApiKey
    });

  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update API key'
    });
  }
};

export const deleteApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    await prisma.apiKey.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete API key'
    });
  }
};

export const getWebhooks = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;

    const webhooks = await prisma.webhook.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: webhooks
    });

  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch webhooks'
    });
  }
};

export const createWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const { url, events } = req.body;
    const businessId = req.user.businessId;

    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'URL and events array are required'
      });
    }

    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        businessId,
        url,
        events,
        secret
      }
    });

    res.status(201).json({
      success: true,
      message: 'Webhook created successfully',
      data: webhook
    });

  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create webhook'
    });
  }
};

export const updateWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { url, events, isActive } = req.body;
    const businessId = req.user.businessId;

    const webhook = await prisma.webhook.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: 'Webhook not found'
      });
    }

    const updatedWebhook = await prisma.webhook.update({
      where: { id },
      data: {
        url,
        events,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: 'Webhook updated successfully',
      data: updatedWebhook
    });

  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update webhook'
    });
  }
};

export const deleteWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const webhook = await prisma.webhook.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: 'Webhook not found'
      });
    }

    await prisma.webhook.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Webhook deleted successfully'
    });

  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete webhook'
    });
  }
};