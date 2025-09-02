// controllers/business/getTeamMembers.controller.ts
import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';

const prisma = new PrismaClient();

// Define types for the mapped responses
interface TeamMemberResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  lastActive: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
}

interface InvitationResponse {
  id: string;
  email: string;
  role: string;
  invitedBy: {
    firstName: string;
    lastName: string;
  };
  status: string;
  expiresAt: Date;
  createdAt: Date;
}

export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const businessId = req.user.businessId;

    if (!businessId) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Get team members
    const teamMembers = await prisma.user.findMany({
      where: {
        businessId: businessId,
        ...(search && {
          OR: [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { lastName: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        role: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get pending invitations
    const invitations = await prisma.invitation.findMany({
      where: {
        businessId: businessId,
        status: 'pending'
      },
      include: {
        invitedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Map team members with explicit typing
    const mappedTeamMembers: TeamMemberResponse[] = teamMembers.map((member: User & { role: Role }) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      isActive: member.isActive,
      lastActive: member.lastActive,
      lastLogin: member.lastLogin,
      createdAt: member.createdAt
    }));

    // Map invitations with explicit typing
    const mappedInvitations: InvitationResponse[] = invitations.map((invitation: Invitation & { invitedBy: { firstName: string; lastName: string } }) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Team members retrieved successfully',
      teamMembers: mappedTeamMembers,
      invitations: mappedInvitations
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};