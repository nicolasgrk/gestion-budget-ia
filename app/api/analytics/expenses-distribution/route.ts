import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let dateFilter = {};

    if (month) {
      const [yearPart, monthPart] = month.split('-');
      const startDate = new Date(parseInt(yearPart), parseInt(monthPart) - 1, 1);
      const endDate = new Date(parseInt(yearPart), parseInt(monthPart), 0);
      dateFilter = {
        dateOp: {
          gte: startDate,
          lte: endDate
        }
      };
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31);
      dateFilter = {
        dateOp: {
          gte: startDate,
          lte: endDate
        }
      };
    } else if (start && end) {
      dateFilter = {
        dateOp: {
          gte: new Date(start),
          lte: new Date(end)
        }
      };
    }

    // Récupérer toutes les transactions avec un montant négatif (dépenses)
    const expenses = await prisma.transaction.findMany({
      where: {
        amount: {
          lt: 0
        },
        ...dateFilter
      },
      select: {
        amount: true,
        categoryParent: true
      }
    });

    // Regrouper les dépenses par catégorie parent
    const categoryTotals = expenses.reduce((acc: { [key: string]: number }, expense) => {
      const categoryParent = expense.categoryParent || 'Non catégorisé';
      acc[categoryParent] = (acc[categoryParent] || 0) + Math.abs(expense.amount);
      return acc;
    }, {});

    // Calculer le total des dépenses
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Convertir en format attendu par le graphique
    const distribution = Object.entries(categoryTotals)
      .map(([categoryParent, amount]) => ({
        category: categoryParent,
        amount: Number(amount.toFixed(2)),
        percentage: Number(((amount / totalExpenses) * 100).toFixed(2))
      }))
      .sort((a, b) => b.amount - a.amount);

    return NextResponse.json(distribution);
  } catch (error) {
    console.error('Erreur lors de la récupération de la distribution des dépenses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la distribution des dépenses' },
      { status: 500 }
    );
  }
} 