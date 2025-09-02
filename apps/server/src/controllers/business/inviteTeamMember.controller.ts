// controllers/business/inviteTeamMember.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import { generateToken } from '@/lib/utils';
import { sendMail } from '@/utils/mailer';
import { TeamInvitationEmail } from '@/emails/TeamInvitationEmail';

const prisma = new PrismaClient();

export const inviteTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and role are required'
      });
    }

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { business: true }
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if user already exists in the system with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      // If user exists, check if they're already in this business
      const existingMember = await prisma.user.findFirst({
        where: {
          id: existingUser.id,
          businessId: user.businessId
        }
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'User already exists in this business'
        });
      }
    }

    // Check if pending invitation exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        businessId: user.businessId,
        status: 'pending'
      }
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: 'Pending invitation already exists for this email'
      });
    }

    // Create invitation with proper token
    const token = generateToken(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role,
        token,
        expiresAt,
        businessId: user.businessId,
        invitedById: user.id,
        status: 'pending'
      }
    });

    // Build the invitation URL
    const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;

    // Send invitation email
    await sendMail({
      to: email,
      subject: `You've been invited to join ${user.business.name} on Sendexa`,
      react: TeamInvitationEmail({
        businessName: user.business.name,
        inviterName: `${user.firstName} ${user.lastName}`,
        invitationUrl,
        role
      }),
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }
    });

  } catch (error) {
    console.error('Invite team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};