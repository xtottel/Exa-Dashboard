// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: roleData,
      create: roleData,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });