// import "dotenv/config";
// import { sendMail } from "@/utils/mailer";
// import { WelcomeEmail } from "@/emails/WelcomeEmail";
// import { TeamInvitationEmail } from '@/emails/TeamInvitationEmail';

// (async () => {
//   try {
//     const testRecipient = "khodelhord@gmail.com"; // Replace with your test email
//     const testUrl = `${process.env.FRONTEND_URL}/dashboard`;
//     const testName = "Collins Joe";

//     await sendMail({
//       to: testRecipient,
//       subject: "Welcome to Sendexa 🎉",
//       react: WelcomeEmail({ name: testName, url: testUrl }),
//     });

//     console.log(`✅ Test email sent to ${testRecipient}`);
//   } catch (err) {
//     console.error("❌ Failed to send test email:", err);
//   }
// })();


import "dotenv/config";
import { sendMail } from "@/utils/mailer";
import { TeamInvitationEmail } from '@/emails/TeamInvitationEmail';

(async () => {
  try {
    const testRecipient = "khodelhord@gmail.com"; // Replace with your test email
    
    // Test data for the invitation email
    const testBusinessName = "Xtopay Ltd";
    const testInviterName = "Cyren Omondi";
    const testRole = "Administrator";
    const testInvitationUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=test-token-123&email=${testRecipient}`;

    // Send invitation email
    await sendMail({
      to: testRecipient,
      subject: `You've been invited to join ${testBusinessName} on Sendexa`,
      react: TeamInvitationEmail({
        businessName: testBusinessName,
        inviterName: testInviterName,
        invitationUrl: testInvitationUrl,
        role: testRole
      }),
    });

    console.log(`✅ Test invitation email sent to ${testRecipient}`);
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
})();