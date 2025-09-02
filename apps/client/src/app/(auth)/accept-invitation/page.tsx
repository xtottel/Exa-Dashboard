import AcceptInvitationForm from "@/components/auth/AcceptInvitationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Log in to your Sendexa account to access your messaging and email services.",
};

export default function LogIn() {
  return <AcceptInvitationForm />;
}
