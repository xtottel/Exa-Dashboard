// apps/api/src/controllers/v1/user/update.controller.ts

import { Request, Response } from "express";
import { prisma } from "../../../config/prisma";

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  res.json(user);
};
