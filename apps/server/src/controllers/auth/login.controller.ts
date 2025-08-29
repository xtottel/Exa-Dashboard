// controllers/auth/login.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendMail } from "@/utils/mailer";
import OTPEmail from "@/emails/OTPEmail";
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, deviceInfo } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Track login attempt
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success: false
      }
    });

    // Check rate limiting
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        },
        success: false
      }
    });

    if (recentAttempts >= 10) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.'
      });
    }

    // Find user with business information
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        business: {
          include: {
            settings: true
          }
        },
        role: true,
        mfaSettings: true,
        loginAttempts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if business is active
    if (!user.business.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Business account is deactivated. Please contact support.'
      });
    }

    // Check failed login attempts
    const failedAttempts = user.loginAttempts.filter(attempt => !attempt.success);
    const maxAttempts = user.business.settings?.maxLoginAttempts || 5;
    
    if (failedAttempts.length >= maxAttempts) {
      return res.status(401).json({
        success: false,
        message: 'Account locked due to too many failed attempts. Please reset your password or contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Update login attempt
      await prisma.loginAttempt.updateMany({
        where: { email, success: false },
        data: { userId: user.id }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check if MFA is required
    const businessRequiresMFA = user.business.settings?.mfaRequired || false;
    const userHasMFA = user.mfaSettings?.isEnabled || false;

    if (businessRequiresMFA || userHasMFA) {
      // Generate OTP for MFA
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.oTP.upsert({
        where: { 
          email_type: {
            email,
            type: 'LOGIN_2FA'
          }
        },
        update: {
          otp,
          expiresAt: otpExpiry
        },
        create: {
          email,
          otp,
          type: 'LOGIN_2FA',
          expiresAt: otpExpiry
        }
      });

      // Send OTP via email
      const name = `${user.firstName} ${user.lastName}`;
      await sendMail({
        to: email,
        subject: 'Your Login Verification Code',
        react: OTPEmail({ name, otp, type: 'login' }),
      });

      // Create temporary auth token for MFA flow
      const mfaToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          purpose: 'mfa_verification'
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.status(200).json({
        success: true,
        message: 'MFA required',
        requiresMFA: true,
        mfaToken,
        mfaMethod: user.mfaSettings?.method || 'EMAIL'
      });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create auth session
    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        sessionToken: accessToken,
        refreshToken,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    // Update login attempt as successful
    await prisma.loginAttempt.updateMany({
      where: { email, success: false },
      data: { 
        userId: user.id,
        success: true 
      }
    });

    // Update user's last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set session token in cookie
    res.cookie('sessionToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken: session.refreshToken,
      sessionId: session.id,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// MFA Verification Controller
export const verifyMFA = async (req: Request, res: Response) => {
  try {
    const { mfaToken, otp, deviceInfo } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    if (!mfaToken || !otp) {
      return res.status(400).json({
        success: false,
        message: 'MFA token and OTP are required'
      });
    }

    // Verify MFA token
    let decoded: any;
    try {
      decoded = jwt.verify(mfaToken, JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }

    if (typeof decoded === 'string' || decoded.purpose !== 'mfa_verification') {
      return res.status(401).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        business: true,
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

    // Verify OTP
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email: user.email,
        type: 'LOGIN_2FA',
        otp
      }
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Clean up used OTP
    await prisma.oTP.delete({
      where: { id: otpRecord.id }
    });

    // Generate final tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create auth session
    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        sessionToken: accessToken,
        refreshToken,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    // Update user's last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Set cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('sessionToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'MFA verification successful',
      accessToken,
      refreshToken: session.refreshToken,
      sessionId: session.id,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Token generation helpers
function generateAccessToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
      email: user.email,
      role: user.role?.name || 'User',
      permissions: user.role?.permissions || [],
      type: 'access_token'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      type: 'refresh_token'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}