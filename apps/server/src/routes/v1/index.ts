// apps/api/src/routes/v1/index.ts

/**
 * @file index.ts
 * @description This file defines the routes for the v1 API.
 * It includes routes for user authentication, user management, and other related functionality.
 * @requires express
 * @requires auth.ts
 * @requires user.ts
 */

import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";

const router = Router();

// Mounting routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.get("/", (_req, res) => {
  res.json({ message: "Welcome to API v1 🚀 (internal)" });
});

export default router;
