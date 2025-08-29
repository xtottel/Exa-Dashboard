// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token in multiple locations
    let token = req.headers['authorization']?.split(' ')[1] || 
                req.cookies?.sessionToken || 
                req.query?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (typeof decoded === 'string' || decoded.type !== 'access_token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check session in database
    const session = await prisma.authSession.findFirst({
      where: {
        sessionToken: token,
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          include: {
            business: true,
            role: true
          }
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid'
      });
    }

    // Check if user is active
    if (!session.user.isActive || !session.user.business.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account deactivated'
      });
    }

    // Add user and session to request
    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const authenticateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    if (typeof decoded === 'string' || decoded.type !== 'refresh_token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Check session in database
    const session = await prisma.authSession.findFirst({
      where: {
        refreshToken,
        revokedAt: null
      },
      include: {
        user: {
          include: {
            business: true,
            role: true
          }
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    if (session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: session.user.id,
        businessId: session.user.businessId,
        email: session.user.email,
        role: session.user.role.name,
        permissions: session.user.role.permissions,
        type: 'access_token'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update session with new token
    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        sessionToken: newAccessToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    // Set new session token cookie
    res.cookie('sessionToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    req.user = session.user;
    next();
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = req.user.role.permissions || [];
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};