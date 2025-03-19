import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

async function getYearData(year: number) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Récupérer toutes les transactions de l'année
  const transactions = await prisma.transaction.findMany({
    where: {
      dateOp: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    orderBy: {
      dateOp: 'asc',
    },
  });

  // Organiser les données par mois
  const monthlyData = months.map(month => {
    // Filtrer les transactions pour ce mois
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.dateOp);
      return transactionDate.getMonth() + 1 === month;
    });

    // Prendre le dernier solde du mois s'il existe
    const lastTransaction = monthTransactions[monthTransactions.length - 1];
    const balance = lastTransaction ? Number(lastTransaction.accountBalance) : null;

    return {
      month,
      balance,
    };
  });

  // Remplir les mois sans données avec le dernier solde connu
  let lastKnownBalance: number | null = null;
  return monthlyData.map(data => {
    if (data.balance !== null) {
      lastKnownBalance = data.balance;
      return data;
    }
    return {
      month: data.month,
      balance: lastKnownBalance,
    };
  });
}

export async function GET() {
  try {
    const currentYear = 2025;
    const lastYear = 2024;

    const [currentYearData, lastYearData] = await Promise.all([
      getYearData(currentYear),
      getYearData(lastYear),
    ]);

    return NextResponse.json({
      currentYear: {
        year: currentYear,
        data: currentYearData,
      },
      lastYear: {
        year: lastYear,
        data: lastYearData,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évolution du solde:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'évolution du solde' },
      { status: 500 }
    );
  }
} 