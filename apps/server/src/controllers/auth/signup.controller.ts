
// controllers/auth/signup.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, AccountType } from "@prisma/client";
import { sendMail } from "@/utils/mailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
import crypto from "crypto";
import { validatePasswordStrength } from "@/utils/security";

// Configure Prisma with increased timeout
const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 30000,
    timeout: 30000,
  },
});

// Function to generate business ID in format 080XXXX
const generateBusinessId = async (): Promise<string> => {
  const businessCount = await prisma.business.count();
  const nextNumber = businessCount + 1;
  const numberPart = nextNumber.toString().padStart(4, "0");
  return `080${numberPart}`;
};

// Function to generate user ID in format EXA-280XXXX
const generateUserId = async (): Promise<string> => {
  const userCount = await prisma.user.count();
  const nextNumber = userCount + 1;
  const numberPart = nextNumber.toString().padStart(4, "0");
  return `EXA-280${numberPart}`;
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { businessName, firstName, lastName, email, phone, password } =
      req.body;

    // Validate required fields
    if (!businessName || !firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check if business name is taken
    const existingBusiness = await prisma.business.findUnique({
      where: { name: businessName },
    });

    if (existingBusiness) {
      return res.status(409).json({
        success: false,
        message: "Business name is already taken",
      });
    }

    // Generate custom IDs
    const businessId = await generateBusinessId();
    const userId = await generateUserId();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create business and user in transaction
    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
        // Create business with custom ID
        const business = await tx.business.create({
          data: {
            id: businessId,
            name: businessName,
            phone,
            email, // Added email field for business
            isActive: true,
          },
        });

        // Create default business settings
        await tx.businessSettings.create({
          data: {
            businessId: business.id,
            securityLevel: "STANDARD",
            mfaRequired: false,
            sessionTimeout: 1440,
            maxLoginAttempts: 5,
          },
        });

        // Get or create default owner role
        let defaultRole = await tx.role.findFirst({
          where: { name: "owner" },
        });

        if (!defaultRole) {
          defaultRole = await tx.role.create({
            data: {
              name: "owner",
              description: "Business owner with full permissions",
              permissions: ["*"],
            },
          });
        }

        // Create user with custom ID
        const user = await tx.user.create({
          data: {
            id: userId,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            businessId: business.id,
            roleId: defaultRole.id,
            isActive: true,
          },
          include: {
            business: true,
            role: true,
          },
        });

        // Create MFA settings for user
        await tx.mFASettings.create({
          data: {
            userId: user.id,
            method: "NONE",
            isEnabled: false,
            backupCodes: [],
          },
        });

        // CREATE WELCOME CREDITS FOR ALL ACCOUNT TYPES
        const accountTypes = [AccountType.SMS, AccountType.SERVICE, AccountType.GENERAL];
        const welcomeCredits = {
          [AccountType.SMS]: 50,      // 50 free SMS credits
          [AccountType.SERVICE]: 10, // $10 service credit
          [AccountType.GENERAL]: 20  // $20 general credit
        };

        for (const type of accountTypes) {
          const account = await tx.businessAccount.create({
            data: {
              businessId: business.id,
              type,
              balance: welcomeCredits[type],
              currency: 'GHS'
            }
          });

          // Create transaction record for welcome bonus
          await tx.creditTransaction.create({
            data: {
              businessId: business.id,
              accountId: account.id,
              type: 'WELCOME_BONUS',
              amount: welcomeCredits[type],
              balance: welcomeCredits[type],
              description: `Welcome bonus - ${welcomeCredits[type]} ${type.toLowerCase()} credits`
            }
          });
        }

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await tx.verificationToken.create({
          data: {
            token: verificationToken,
            expires: verificationExpiry,
            userId: user.id,
            identifier: email,
          },
        });

        return { user, verificationToken, welcomeCredits };
      });
    } catch (transactionError) {
      console.error("Transaction error:", transactionError);
      throw new Error("Failed to create user and business");
    }

    // Send verification email with welcome credits information
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${result.verificationToken}`;
    const name = `${firstName} ${lastName}`;

    await sendMail({
      to: email,
      subject: "Verify your email and claim your welcome credits! 🎉",
      react: VerificationEmail({ 
        name, 
        url: verificationUrl,
      }),
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = result.user;

    res.status(201).json({
      success: true,
      message: "User created successfully with welcome credits! Please check your email to verify your account.",
      user: userWithoutPassword,
      welcomeCredits: result.welcomeCredits
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};