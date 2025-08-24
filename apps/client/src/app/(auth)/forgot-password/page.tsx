import ForgotPasswordForm from "../../../components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password ",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <ForgotPasswordForm />;
}
