/**
 * @file auth.ts
 * @description This file defines the authentication routes for the application.
 * It includes routes for user signup, login, logout, password recovery, email verification,
 * and resending verification emails.
 * Each route is handled by a dedicated controller that encapsulates the logic for each operation.
 *
 * @module routes/v1/auth
 */

import { Router } from "express";

import { signup } from "../../controllers/v1/auth/signup.controller";

import { login } from "../../controllers/v1/auth/login.controller";
import { logout } from "../../controllers/v1/auth/logout.controller";
import { forgot } from "../../controllers/v1/auth/forgot.controller";
import { reset } from "../../controllers/v1/auth/reset.controller";
import { verify } from "../../controllers/v1/auth/verify.controller";
import { resend } from "../../controllers/v1/auth/resend.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgot);
router.post("/reset-password", reset);
router.post("/verify-email", verify);
router.post("/resend-verification", resend);

export default router;
