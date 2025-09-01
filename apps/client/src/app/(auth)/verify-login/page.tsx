import OTPForm from "@/components/auth/OTPForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Login",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <OTPForm />;
}
