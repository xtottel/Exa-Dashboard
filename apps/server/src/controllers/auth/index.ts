// controllers/auth/index.ts
import { login } from "./login.controller";
import { otp } from "./otp.controller";
import { signup } from "./signup.controller";
import { verifyEmail } from "./verifyEmail.controller";
import { forgotPassword } from "./forgetPassword.controller";
import { resetPassword } from "./resetPassword.controller";
import { resendVerification } from "./resendVerification.controller";
import { refresh } from "./refresh.controller";
import { logout, logoutAllSessions, logoutSession } from "./logout.controller";
import { verify } from "./tokenVerify.controller";

export const authController = {
  login,
  otp,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
  refresh,
  logout,
  logoutAllSessions,
  logoutSession,
  verify,
};