// controllers/business/acceptInvitation.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "@/middleware/auth";
import { hashPassword } from "@/lib/utils";

const prisma = new PrismaClient();

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const { token, email, password, firstName, lastName } = req.body;
    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Token and email are required",
      });
    }

    // Find the invitation
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        email: email.toLowerCase(),
        status: "pending",
      },
      include: {
        business: true,
        invitedBy: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired invitation",
      });
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "expired" },
      });

      return res.status(400).json({
        success: false,
        message: "Invitation has expired",
      });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // If user exists, add them to the business
      await prisma.user.update({
        where: { id: user.id },
        data: {
          businessId: invitation.businessId,
          role: invitation.role,
        },
      });
    } else {
      // If user doesn't exist, create new user
      if (!password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message:
            "Password, first name, and last name are required for new users",
        });
      }

      const hashedPassword = await hashPassword(password);

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          firstName,
          lastName,
          password: hashedPassword,
          businessId: invitation.businessId,
          role: invitation.role,
          emailVerified: new Date(), // Auto-verify since they're invited
        },
      });
    }

    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
