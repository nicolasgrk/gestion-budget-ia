import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/prisma'

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données' },
        { status: 500 }
      )
    }

    return NextResponse.json({ status: 'ok', message: 'Connexion à la base de données réussie' })
  } catch (error) {
    console.error('Erreur lors du test de connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors du test de connexion' },
      { status: 500 }
    )
  }
} 