import { Router } from "express";

const router = Router();

// Mounting routes

// D
router.get("/", (_req, res) => {
  res.json({ message: "Welcome to API v1 🚀 (internal)" });
});

export default router;
