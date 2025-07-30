// src/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";

// V1: Internal - Stricter (e.g., 30 requests per 15 min)
export const v1RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Too many requests to v1. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// V2: External - More relaxed (e.g., 100 requests per 15 min)
export const v2RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests to v2. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
