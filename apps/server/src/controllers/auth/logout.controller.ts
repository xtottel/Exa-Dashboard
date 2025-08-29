// controllers/auth/logout.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                 req.cookies?.sessionToken;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No session token provided'
      });
    }

    // Verify the token to get user ID
    let userId: string;
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (jwtError) {
      // If token is invalid, still clear cookies but don't update database
      clearCookies(res);
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    // Revoke the current session in database
    if (userId) {
      await prisma.authSession.updateMany({
        where: {
          sessionToken: token,
          userId: userId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });
    }

    // Clear all authentication cookies
    clearCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    // Still attempt to clear cookies even if there's an error
    clearCookies(res);
    
    res.status(500).json({
      success: false,
      message: 'Failed to logout'
    });
  }
};

// Helper function to clear all authentication cookies
const clearCookies = (res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/'
  };

  // Clear all possible authentication cookies
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('sessionToken', cookieOptions);
  res.clearCookie('token', cookieOptions);
  
  // Additional cookies that might be used
  res.clearCookie('authToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
};

// Alternative: Logout all sessions for the user
export const logoutAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Revoke all active sessions for the user
    await prisma.authSession.updateMany({
      where: {
        userId: userId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });

    // Clear all authentication cookies
    clearCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all sessions error:', error);
    clearCookies(res);
    
    res.status(500).json({
      success: false,
      message: 'Failed to logout from all devices'
    });
  }
};

// Optional: Session-specific logout if you have session ID
export const logoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Revoke specific session
    const session = await prisma.authSession.findFirst({
      where: {
        id: sessionId,
        userId: userId
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await prisma.authSession.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date()
      }
    });

    // If this is the current session, also clear cookies
    const currentToken = req.headers.authorization?.split(' ')[1] || 
                        req.cookies?.sessionToken;
    
    if (session.sessionToken === currentToken) {
      clearCookies(res);
    }

    res.status(200).json({
      success: true,
      message: 'Session logged out successfully'
    });

  } catch (error) {
    console.error('Logout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout session'
    });
  }
};