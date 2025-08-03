// src/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";

export const RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
