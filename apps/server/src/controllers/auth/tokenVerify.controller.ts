// tokenVerify.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const verify = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: string;
      type: string;
      exp: number;
    };
    
    // Check if token is an access token
    if (decoded.type !== 'access_token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // Find user with business and role information
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        business: {
          include: {
            settings: true
          }
        },
        role: true,
        mfaSettings: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    if (!user.business.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Business account is deactivated'
      });
    }

    // Check if session is still valid
    const session = await prisma.authSession.findFirst({
      where: {
        sessionToken: token,
        userId: user.id,
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid'
      });
    }

    // Return user data without sensitive information
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        business: {
          id: user.business.id,
          name: user.business.name,
          isActive: user.business.isActive,
          settings: user.business.settings
        },
        role: user.role,
        mfaSettings: user.mfaSettings
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Additional endpoint for quick token validation (for middleware)
export const quickVerify = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Quick verification without database checks for middleware
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: string;
      type: string;
      exp: number;
    };
    
    if (decoded.type !== 'access_token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      userId: decoded.userId
    });

  } catch (error) {
    console.error('Quick token verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};