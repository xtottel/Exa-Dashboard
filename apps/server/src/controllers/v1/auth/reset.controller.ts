// apps/api/src/controllers/v1/auth/reset.controller.ts
// This controller handles user password reset functionality

import { Request, Response } from "express";
import { sendMail } from "../../../utils/email";
import { prisma } from "../../../config/prisma";
import bcrypt from "bcryptjs";
import { BASE_URL } from "../../../config/constants";

export const reset = async (req: Request, res: Response) => {
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) {
    return res.status(400).json({ message: "Missing token or password" });
  }

  // 1. Find recovery token
  const tokenRecord = await prisma.resetToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: token,
      },
    },
  });

  if (!tokenRecord) {
    return res.status(404).json({ message: "Invalid or expired token" });
  }

  const { identifier, expiresAt } = tokenRecord;

  // 2. Check token expiry
  if (new Date(expiresAt) < new Date()) {
    return res.status(401).json({ message: "Token expired" });
  }

  // 3. Find user
  const user = await prisma.user.findUnique({ where: { email: identifier } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 4. Hash and update new password
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: identifier },
    data: { password: hashed },
  });

  // 5. Delete the token after use
  await prisma.resetToken.delete({
    where: {
      identifier_token: {
        token,
        identifier,
      },
    },
  });

  // 6. Send confirmation email
  await sendMail({
    to: user.email,
    subject: "Password reset",
    html: `
      <h1>Password reset</h1>
      <p>Your password has been reset. You can now log in with your new password.</p>
      <a href="${BASE_URL}/auth/login">Login</a>
    `,
  });

  // 7. Respond
  res.status(200).json({
    message: "Password reset successful ✅",
    user: { id: user.id, email: user.email },
  });
};
