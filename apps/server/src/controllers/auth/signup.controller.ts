// apps/api/src/controllers/v1/auth/signup.controller.ts
/**
 * @file signup.controller.ts
 * @description This file defines the signup controller for the application.
 * It handles user registration and creates a verification token for the user.
 * It also sends a verification email to the user.
 * @requires express
 * @requires bcryptjs
 * @requires prisma
 * @requires email utility
 * @requires constants
 */

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../config/prisma";
import { sendMail } from "../../../utils/email";
import { randomBytes } from "crypto";
import { BASE_URL } from "../../../config/constants";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing name, email or password" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = randomBytes(32).toString("hex");

  // Save verification token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour
    },
  });

  // Send verification email
  await sendMail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${BASE_URL}/auth/verify-email?token=${token}&email=${email}">Verify email</a>
    `,
  });

  res.status(201).json({
    message: "User created ✅ Please verify your email",
    user: { id: user.id, email: user.email },
  });
};
