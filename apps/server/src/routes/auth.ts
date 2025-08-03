import { Router } from "express";
import { signup } from "../controllers/auth/signup.controller";

import { login } from "../controllers/auth/login.controller";
import { logout } from "../controllers/auth/logout.controller";
import { forgot } from "../controllers/auth/forgot.controller";
import { reset } from "../controllers/auth/reset.controller";
import { verify } from "../controllers/auth/verify.controller";
import { resend } from "../controllers/auth/resend.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgot);
router.post("/reset-password", reset);
router.post("/verify-email", verify);
router.post("/resend-verification", resend);

export default router;
