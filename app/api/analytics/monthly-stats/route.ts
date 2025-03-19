import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let startDate: Date;
    let endDate: Date;

    if (month) {
      // Format month: "YYYY-MM"
      const [year, monthNum] = month.split('-').map(Number);
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    } else if (year) {
      startDate = new Date(Number(year), 0, 1);
      endDate = new Date(Number(year), 11, 31);
    } else if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      // Par défaut : mois en cours
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Ajuster les heures pour inclure toute la journée
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Récupérer les transactions de la période
    const transactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        amount: true,
        dateOp: true
      }
    });

    // Récupérer les transactions de la période précédente (même durée)
    const duration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - duration);
    const previousEndDate = new Date(startDate.getTime() - 1);

    const previousTransactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: previousStartDate,
          lte: previousEndDate
        }
      },
      select: {
        amount: true,
        dateOp: true
      }
    });

    // Calculer les statistiques de la période actuelle
    const currentStats = transactions.reduce(
      (acc: { expenses: number; income: number }, transaction) => {
        const amount = Number(transaction.amount);
        if (amount < 0) {
          acc.expenses += Math.abs(amount);
        } else {
          acc.income += amount;
        }
        return acc;
      },
      { expenses: 0, income: 0 }
    );

    // Calculer les statistiques de la période précédente
    const previousStats = previousTransactions.reduce(
      (acc: { expenses: number; income: number }, transaction) => {
        const amount = Number(transaction.amount);
        if (amount < 0) {
          acc.expenses += Math.abs(amount);
        } else {
          acc.income += amount;
        }
        return acc;
      },
      { expenses: 0, income: 0 }
    );

    // Calculer le nombre de transactions
    const transactionCount = transactions.length;
    const previousTransactionCount = previousTransactions.length;

    // Calculer la variation du nombre de transactions
    const transactionCountChange = previousTransactionCount === 0 
      ? 0 
      : ((transactionCount - previousTransactionCount) / previousTransactionCount) * 100;

    // Calculer les variations en pourcentage
    const expensesChange = previousStats.expenses === 0 
      ? 0 
      : ((currentStats.expenses - previousStats.expenses) / previousStats.expenses) * 100;

    const savingsChange = previousStats.income === 0 
      ? 0 
      : (((currentStats.income - currentStats.expenses) - (previousStats.income - previousStats.expenses)) / (previousStats.income - previousStats.expenses)) * 100;

    // Calculer le ratio d'épargne
    const savingsRatio = currentStats.income === 0 
      ? 0 
      : ((currentStats.income - currentStats.expenses) / currentStats.income) * 100;

    // Calculer le nombre de jours sans dépense
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysWithSpending = new Set(
      transactions
        .filter(t => t.amount < 0)
        .map(t => t.dateOp.toISOString().split('T')[0])
    ).size;
    const daysWithoutSpending = daysInPeriod - daysWithSpending;

    return NextResponse.json({
      currentMonth: {
        savings: (currentStats.income - currentStats.expenses).toFixed(2),
        expenses: currentStats.expenses.toFixed(2),
        income: currentStats.income.toFixed(2),
        savingsRatio: savingsRatio.toFixed(2),
        transactionCount,
        daysWithoutSpending
      },
      lastMonth: {
        transactionCount: previousTransactionCount
      },
      changes: {
        savingsChange: savingsChange.toFixed(2),
        expensesChange: expensesChange.toFixed(2),
        transactionCountChange: transactionCountChange.toFixed(2),
        daysWithoutSpendingChange: 0 // À implémenter si nécessaire
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques mensuelles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques mensuelles' },
      { status: 500 }
    );
  }
} 