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
