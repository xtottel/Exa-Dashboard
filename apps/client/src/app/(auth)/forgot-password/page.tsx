import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Sendexa Dashboard",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <ForgotPasswordForm />;
}
