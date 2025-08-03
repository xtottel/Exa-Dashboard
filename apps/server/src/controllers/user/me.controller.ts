// apps/api/src/controllers/v1/user/me.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const getMe = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
};
