import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, content, category } = req.body;
    const businessId = req.user.businessId;

    if (!name || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, content, and category are required'
      });
    }

    // Extract variables from content
    const variables = extractVariables(content);

    const template = await prisma.template.create({
      data: {
        businessId,
        name,
        content,
        category,
        variables
      }
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template'
    });
  }
};

export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user.businessId;
    const { page = 1, limit = 10, category, search } = req.query;

    const where: any = { businessId };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { content: { contains: search as string } }
      ];
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.template.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: templates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
};

export const getTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const template = await prisma.template.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template'
    });
  }
};

export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, content, category } = req.body;
    const businessId = req.user.businessId;

    const template = await prisma.template.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Extract variables from content
    const variables = extractVariables(content);

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name,
        content,
        category,
        variables,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate
    });

  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template'
    });
  }
};

export const deleteTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const businessId = req.user.businessId;

    const template = await prisma.template.findFirst({
      where: {
        id,
        businessId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await prisma.template.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template'
    });
  }
};

// Helper function to extract variables from template content
function extractVariables(content: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return Array.from(new Set(matches)); // Remove duplicates
}