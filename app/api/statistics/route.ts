import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtenir le premier et dernier jour du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    console.log('Période de recherche:', {
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString()
    });

    // Récupérer le total des dépenses du mois
    const totalExpenses = await prisma.transaction.aggregate({
      where: {
        AND: [
          { amount: { lt: 0 } },
          {
            dateOp: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        ]
      },
      _sum: {
        amount: true
      }
    });

    // Récupérer le total des revenus du mois
    const totalIncome = await prisma.transaction.aggregate({
      where: {
        AND: [
          { amount: { gt: 0 } },
          {
            dateOp: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        ]
      },
      _sum: {
        amount: true
      }
    });

    // Récupérer le solde actuel
    const latestTransaction = await prisma.transaction.findFirst({
      orderBy: {
        dateOp: 'desc'
      }
    });

    // Log pour debug
    console.log('Résultats:', {
      totalExpenses: totalExpenses._sum.amount,
      totalIncome: totalIncome._sum.amount,
      currentBalance: latestTransaction?.accountBalance
    });

    return NextResponse.json({
      totalExpenses: Math.abs(totalExpenses._sum.amount || 0),
      totalIncome: totalIncome._sum.amount || 0,
      currentBalance: latestTransaction?.accountBalance || 0
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 