// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateBackupCodes } from './src/utils/security'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator with full access rights',
      permissions: ['*'] // All permissions
    }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Standard user with limited access',
      permissions: [
        'read:profile',
        'update:profile',
        'read:dashboard',
        'read:transactions'
      ]
    }
  })

  const supportRole = await prisma.role.upsert({
    where: { name: 'Support' },
    update: {},
    create: {
      name: 'Support',
      description: 'Support staff with customer access',
      permissions: [
        'read:profile',
        'read:dashboard',
        'read:transactions',
        'manage:support_tickets'
      ]
    }
  })

  console.log(`Created roles: ${adminRole.name}, ${userRole.name}, ${supportRole.name}`)
  
  // Create sample business
  const business = await prisma.business.upsert({
    where: { name: 'Example Business Inc.' },
    update: {},
    create: {
      name: 'Example Business Inc.',
      phone: '+1234567890',
      isActive: true
    }
  })

  // Create business settings
  await prisma.businessSettings.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      securityLevel: 'STANDARD',
      mfaRequired: false,
      sessionTimeout: 1440,
      maxLoginAttempts: 5
    }
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+1234567891',
      password: hashedPassword,
      emailVerified: new Date(),
      isActive: true,
      businessId: business.id,
      roleId: adminRole.id,
    }
  })

  // Create MFA settings for admin
  await prisma.mFASettings.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      method: 'NONE',
      isEnabled: false,
      backupCodes: generateBackupCodes()
    }
  })

  console.log(`Created admin user with id: ${adminUser.id}`)
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })