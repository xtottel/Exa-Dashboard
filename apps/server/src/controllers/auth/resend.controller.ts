// apps/api/src/controllers/v1/auth/resend.controller.ts
// This controller handles user verification email resend functionality

import { Request, Response } from "express";
import { sendMail } from "../../../utils/email";
import { prisma } from "../../../config/prisma";
import { randomBytes } from "crypto";
import { BASE_URL } from "../../../config/constants";

export const resend = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${BASE_URL}/auth/verify-email?token=${token}&email=${email}">
        Verify Email
      </a>
    `,
  });

  res.status(200).json({ message: "Verification email sent ✅" });
};
