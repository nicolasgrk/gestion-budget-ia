import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer toutes les transactions des 12 derniers mois
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);

    const transactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        dateOp: true,
        amount: true,
        category: true
      }
    });

    // Obtenir toutes les catégories uniques
    const categories = [...new Set(transactions
      .filter(t => t.amount < 0 && t.category)
      .map(t => t.category))] as string[];

    // Initialiser les données pour chaque mois
    const monthlyData: { [key: string]: { [category: string]: number } } = {};
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(endDate);
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // Format: YYYY-MM
    }).reverse();

    months.forEach(month => {
      monthlyData[month] = {};
      categories.forEach(category => {
        monthlyData[month][category] = 0;
      });
    });

    // Calculer les dépenses par catégorie et par mois
    transactions
      .filter(t => t.amount < 0 && t.category)
      .forEach(transaction => {
        const month = transaction.dateOp.toISOString().slice(0, 7);
        const category = transaction.category as string;
        
        if (monthlyData[month] && categories.includes(category)) {
          monthlyData[month][category] += Math.abs(transaction.amount);
        }
      });

    // Formater les données pour le graphique
    const data = months.map(month => {
      const monthData: { [key: string]: number | string } = { month };
      categories.forEach(category => {
        monthData[category] = Number(monthlyData[month][category].toFixed(2));
      });
      return monthData;
    });

    return NextResponse.json({
      categories,
      data
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évolution des dépenses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'évolution des dépenses' },
      { status: 500 }
    );
  }
} 