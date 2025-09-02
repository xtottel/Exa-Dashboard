// controllers/business/resendInvitation.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "@/middleware/auth";
import { generateToken } from "@/lib/utils";
import { sendMail } from "@/utils/mailer";
import { TeamInvitationEmail } from "@/emails/TeamInvitationEmail";

const prisma = new PrismaClient();

export const resendInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { invitationId } = req.params;

    // Get user's business
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { business: true },
    });

    if (!user || !user.business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Get the invitation
    const invitation = await prisma.invitation.findFirst({
      where: {
        id: invitationId,
        businessId: user.businessId,
        status: "pending",
      },
      include: { role: true },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    // Generate new token and extend expiration
    const newToken = generateToken(32);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 days expiration

    // Update invitation
    const updatedInvitation = await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        token: newToken,
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      },
    });

    // Build the new invitation URL
    const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${newToken}&email=${encodeURIComponent(invitation.email)}`;

    // In resendInvitation.controller.ts, update the email sending part:
    await sendMail({
      to: invitation.email,
      subject: `You've been invited to join ${user.business.name} on Sendexa`,
      react: TeamInvitationEmail({
        businessName: user.business.name,
        inviterName: `${user.firstName} ${user.lastName}`,
        invitationUrl,
        role: invitation.role.name, // Use the role name from the included relation
      }),
    });

    res.status(200).json({
      success: true,
      message: "Invitation resent successfully",
      invitation: updatedInvitation,
    });
  } catch (error) {
    console.error("Resend invitation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
