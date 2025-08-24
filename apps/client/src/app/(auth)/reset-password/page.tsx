import ResetPassword from "@/components/auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password ",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <ResetPassword />;
}
