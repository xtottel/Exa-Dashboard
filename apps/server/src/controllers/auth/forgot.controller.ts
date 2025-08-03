// apps/api/src/controllers/v1/auth/recover.controller.ts
// This controller handles user recover functionality

import { Request, Response } from "express";
import { sendMail } from "../../../utils/email";
import { prisma } from "../../../config/prisma";
import { randomBytes } from "crypto";
import { BASE_URL } from "../../../config/constants";

export const forgot = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // delete any existing recovery tokens for this user
  await prisma.resetToken.deleteMany({
    where: { identifier: email },
  });

  const token = randomBytes(32).toString("hex");

  await prisma.resetToken.create({
    data: {
      identifier: email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour
    },
  });

  await sendMail({
    to: user.email,
    subject: "Recover your password",
    html: `
      <h1>Recover your password</h1>
      <p>Click the link below to recover your password:</p>
     <a href="${BASE_URL}/auth/reset?token=${token}&email=${email}">Recover password</a>
    `,
  });

  res.status(200).json({
    message: "Password recovery email sent ✅",
    user: { id: user.id, email: user.email },
  });
};
