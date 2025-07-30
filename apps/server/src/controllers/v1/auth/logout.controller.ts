// apps/api/src/controllers/v1/auth/logout.controller.ts
/**
 * @file logout.controller.ts
 * @description This file defines the logout controller for the application.
 * It handles user logout and clears the session.
 * @requires express
 */

import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("trenclad-session");
    res.status(200).json({ message: "Logged out successfully" });
  });
};
