import ForgotPasswordForm from "./components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Sendexa",
  description: "Reset your Sendexa account password easily and securely.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
