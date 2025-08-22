import ResendVerificationForm from "./components/ResendVerificationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Verification | Sendexa Dashboard",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <ResendVerificationForm />;
}
