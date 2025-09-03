// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create default roles if they don't exist
  const roles = [
    {
      name: 'owner',
      description: 'Business owner with full permissions',
      permissions: ['*'],
    },
    {
      name: 'admin',
      description: 'Administrator with management permissions',
      permissions: [
        'manage_team',
        'manage_settings',
        'view_reports',
        'send_messages',
      ],
    },
    {
      name: 'member',
      description: 'Team member with basic permissions',
      permissions: ['send_messages', 'view_reports'],
    },
  ];

  for (const roleData of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (existingRole) {
      console.log(`Role "${roleData.name}" already exists, skipping...`);
      continue;
    }

    await prisma.role.create({
      data: roleData
    });
    console.log(`Created role: ${roleData.name}`);
  }

  // Add other seed data here (business accounts, etc.)
  await seedBusinessAccounts();

  console.log('Database seeded successfully');
}

async function seedBusinessAccounts() {
  // Get all businesses
  const businesses = await prisma.business.findMany();
  
  const accountTypes = ['SMS', 'SERVICE', 'GENERAL'] as const;

  for (const business of businesses) {
    for (const type of accountTypes) {
      const existingAccount = await prisma.businessAccount.findUnique({
        where: {
          businessId_type: {
            businessId: business.id,
            type: type
          }
        }
      });

      if (existingAccount) {
        console.log(`Account type "${type}" already exists for business "${business.name}", skipping...`);
        continue;
      }

      // Get latest balance for SMS account migration
      let balance = 0;
      if (type === 'SMS') {
        const latestTransaction = await prisma.creditTransaction.findFirst({
          where: { businessId: business.id },
          orderBy: { createdAt: 'desc' },
          select: { balance: true }
        });
        balance = latestTransaction?.balance || 0;
      }

      await prisma.businessAccount.create({
        data: {
          businessId: business.id,
          type,
          balance,
          currency: 'GHS'
        }
      });
      console.log(`Created ${type} account for business: ${business.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });