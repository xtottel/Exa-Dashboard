// apps/api/src/controllers/v1/auth/verify.controller.ts
// This file handles the email verification process for users.

import { Request, Response } from "express";
import { prisma } from "../../../config/prisma";
import { sendMail } from "../../../utils/email";
import { BASE_URL } from "../../../config/constants";

export const verify = async (req: Request, res: Response) => {
  const { token, email } = req.body;

  if (!token || !email) {
    return res.status(400).json({ message: "Missing token or email" });
  }

  // 1. Check for a valid token
  const validToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  if (!validToken) {
    return res.status(404).json({ message: "Invalid or expired token" });
  }

  // 2. Check if token is expired
  if (new Date(validToken.expiresAt) < new Date()) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return res.status(410).json({ message: "Token has expired" });
  }

  // 3. Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 4. Update user to verified
  await prisma.user.update({
    where: { email: user.email },
    data: { emailVerified: new Date() },
  });

  // 5. Delete used token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        token,
        identifier: email,
      },
    },
  });

  // 6. Send confirmation email
  await sendMail({
    to: user.email,
    subject: "Email verified ✅",
    html: `
      <h1>Email Verified</h1>
      <p>Your email has been verified. You can now log in.</p>
      <a href="${BASE_URL}/auth/login">Login</a>
    `,
  });

  return res.status(200).json({ message: "Verification successful ✅" });
};
