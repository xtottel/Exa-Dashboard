// controllers/user/mfa.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get MFA settings
export const getMfaSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const mfaSettings = await prisma.mFASettings.findUnique({
      where: { userId }
    });

    res.status(200).json({
      success: true,
      message: 'MFA settings retrieved successfully',
      mfaSettings: mfaSettings || {
        method: 'NONE',
        isEnabled: false,
        backupCodes: []
      }
    });

  } catch (error) {
    console.error('Get MFA settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Setup MFA (generate secret and QR code)
export const setupMfa = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `Sendexa (${req.user.email})`,
      length: 20
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    // Check if MFA settings already exist
    const existingMfa = await prisma.mFASettings.findUnique({
      where: { userId }
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    if (existingMfa) {
      // Update existing MFA settings
      await prisma.mFASettings.update({
        where: { userId },
        data: {
          method: 'TOTP',
          secret: secret.base32,
          backupCodes: hashedBackupCodes,
          isEnabled: false,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new MFA settings
      await prisma.mFASettings.create({
        data: {
          userId,
          method: 'TOTP',
          secret: secret.base32,
          backupCodes: hashedBackupCodes,
          isEnabled: false
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'MFA setup initiated successfully',
      qrCode,
      secret: secret.base32,
      backupCodes
    });

  } catch (error) {
    console.error('Setup MFA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify MFA code and enable MFA
export const verifyMfa = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    // Get MFA settings
    const mfaSettings = await prisma.mFASettings.findUnique({
      where: { userId }
    });

    if (!mfaSettings || !mfaSettings.secret) {
      return res.status(400).json({
        success: false,
        message: 'MFA not setup. Please setup MFA first.'
      });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: mfaSettings.secret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Enable MFA
    await prisma.mFASettings.update({
      where: { userId },
      data: {
        isEnabled: true,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'MFA enabled successfully'
    });

  } catch (error) {
    console.error('Verify MFA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Disable MFA
export const disableMfa = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    await prisma.mFASettings.update({
      where: { userId },
      data: {
        method: 'NONE',
        isEnabled: false,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'MFA disabled successfully'
    });

  } catch (error) {
    console.error('Disable MFA error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Regenerate backup codes
export const regenerateBackupCodes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Generate new backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    await prisma.mFASettings.update({
      where: { userId },
      data: {
        backupCodes: hashedBackupCodes,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Backup codes regenerated successfully',
      backupCodes
    });

  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify backup code
export const verifyBackupCode = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Backup code is required'
      });
    }

    const mfaSettings = await prisma.mFASettings.findUnique({
      where: { userId }
    });

    if (!mfaSettings) {
      return res.status(400).json({
        success: false,
        message: 'MFA not enabled'
      });
    }

    // Check if any backup code matches
    let isValid = false;
    for (const hashedCode of mfaSettings.backupCodes) {
      if (await bcrypt.compare(code, hashedCode)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid backup code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Backup code verified successfully'
    });

  } catch (error) {
    console.error('Verify backup code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};