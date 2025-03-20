import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Fonction pour vérifier la connexion
export async function checkDatabaseConnection() {
  try {
    console.log('Tentative de connexion à la base de données...')
    console.log('URL de la base de données:', process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))
    
    await prisma.$queryRaw`SELECT 1`
    console.log('Connexion à la base de données réussie')
    return true
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error)
    return false
  }
} 