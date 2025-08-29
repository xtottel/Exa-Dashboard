import prisma from '../utils/prisma'

async function testConnection() {
  try {
    // Test the connection by querying the database
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('Database connection successful!')
    console.log('PostgreSQL version:', result)
    
    // Check if Business table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Available tables:', tables)
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()