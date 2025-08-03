// apps/api/src/controllers/v1/user/delete.controller.ts

import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    // destroy session and clear cookie
    req.session.destroy(() => {
      res.clearCookie("trenclad-session");
      return res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
