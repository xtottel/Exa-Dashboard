// // controllers/auth/verifyEmail.controller.ts
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const verifyEmail = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: 'Verification token is required'
//       });
//     }

//     // Find verification token
//     const verificationToken = await prisma.verificationToken.findUnique({
//       where: { token },
//       include: { user: true }
//     });

//     if (!verificationToken) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid verification token'
//       });
//     }

//     // Check if token is expired
//     if (verificationToken.expiresAt < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Verification token has expired'
//       });
//     }

//     // Update user email verification status
//     await prisma.$transaction(async (tx) => {
//       await tx.user.update({
//         where: { id: verificationToken.userId },
//         data: { emailVerified: new Date() }
//       });

//       // Delete used token
//       await tx.verificationToken.delete({
//         where: { token }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Email verified successfully'
//     });

//   } catch (error) {
//     console.error('Email verification error:', error);
    
//     // Handle connection errors specifically
//     if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
//       return res.status(503).json({
//         success: false,
//         message: 'Database connection failed. Please try again later.'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Failed to verify email'
//     });
//   }
// };


// controllers/auth/verifyEmail.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '@/utils/mailer';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) {
      return res.status(404).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    // Update user email verification status and get updated user
    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: verificationToken.userId ?? undefined },
        data: { emailVerified: new Date() },
        include: {
          business: {
            include: {
              accounts: true
            }
          }
        }
      });

      // Delete used token
      await tx.verificationToken.delete({
        where: { token }
      });

      return updatedUser;
    });

    // Send welcome email after successful verification
    if (user) {
      const welcomeUrl = `${process.env.FRONTEND_URL}/home`;
      const name = `${user.firstName} ${user.lastName}`;
      
      // Get welcome credits information
      const smsAccount = user.business.accounts.find(acc => acc.type === 'SMS');
      const serviceAccount = user.business.accounts.find(acc => acc.type === 'SERVICE');
      const generalAccount = user.business.accounts.find(acc => acc.type === 'GENERAL');

      await sendMail({
        to: user.email,
        subject: 'Welcome to Sendexa! Your account is now active 🎉',
        react: WelcomeEmail({ 
          name, 
          url: welcomeUrl,
          welcomeCredits: {
            sms: smsAccount?.balance || 0,
            service: serviceAccount?.balance || 0,
            general: generalAccount?.balance || 0
          }
        }),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome credits have been activated.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
};