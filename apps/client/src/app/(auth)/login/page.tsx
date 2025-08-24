import LogInForm from "@/components/auth/LogInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <LogInForm />;
}
