import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import * as React from "react";

// Create the transporter
const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Utility to send an email with text or HTML
export async function sendMail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const html = await render(react);
  return transporter.sendMail({
    from: `Xtopay <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
