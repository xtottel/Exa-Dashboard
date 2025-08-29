import "dotenv/config";
import { sendMail } from "@/utils/mailer";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

(async () => {
  try {
    const testRecipient = "khodelhord@gmail.com"; // Replace with your test email
    const testUrl = `${process.env.FRONTEND_URL}/dashboard`;
    const testName = "Collins Joe";

    await sendMail({
      to: testRecipient,
      subject: "Welcome to Sendexa 🎉",
      react: WelcomeEmail({ name: testName, url: testUrl }),
    });

    console.log(`✅ Test email sent to ${testRecipient}`);
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
})();
