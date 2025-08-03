// apps/api/src/controllers/v1/auth/login.controller.ts

/**
 * @file login.controller.ts
 * @description This file defines the login controller for the application.
 * It handles user login and sets a session for the user.
 * It also sends a welcome email upon successful login.
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
import { BASE_URL } from "../../../config/constants";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.emailVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  /**
   * Set user session
   * This creates a session for the user
   * and
   * stores their user ID in the session.
   */
  req.session.userId = user.id;

  await sendMail({
    to: user.email,
    subject: "New Login Detected",
    html: `
      <h1>Welcome Back!</h1>
      <p> Hey ${user.name}! </p>
      <p>You have successfully logged in to your account. Enjoy your stay!</p>
      <a href="${BASE_URL}/">Home</a>
      <p>If this wasn't you, please secure your account immediately.</p>
      <p>Best regards,</p>
    `,
  });

  res.status(200).json({
    message: "Login successful ✅",
    user: { id: user.id, email: user.email },
  });
};
