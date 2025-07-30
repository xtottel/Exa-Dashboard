import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: `Exa Dashboard <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
