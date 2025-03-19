import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import prisma from '@/lib/prisma';
import { categorizationAgent } from '../../../lib/agents/categorization-agent';

interface CSVTransaction {
  dateOp: string;
  dateVal: string;
  label: string;
  category: string;
  amount: string;
  accountNum: string;
  accountLabel: string;
  accountbalance: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    const csvContent = await (file as File).text();
    const records: CSVTransaction[] = [];

    // Parser le CSV
    await new Promise((resolve, reject) => {
      parse(csvContent, {
        delimiter: ';',
        columns: true,
        skip_empty_lines: true,
      })
        .on('data', (record: CSVTransaction) => {
          records.push(record);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Traiter et sauvegarder les transactions
    const transactions = await Promise.all(
      records.map(async (record) => {
        return prisma.transaction.create({
          data: {
            dateOp: new Date(record.dateOp),
            dateVal: record.dateVal ? new Date(record.dateVal) : null,
            label: record.label,
            category: null,
            categoryParent: null,
            amount: parseFloat(record.amount?.replace(',', '.') || '0'),
            accountNum: record.accountNum,
            accountLabel: record.accountLabel,
            accountBalance: record.accountbalance ? parseFloat(record.accountbalance.replace(',', '.')) : null
          },
        });
      })
    );

    // Lancer la catégorisation automatique
    const categorization = await categorizationAgent();

    return NextResponse.json({ 
      success: true, 
      count: transactions.length,
      categorization: categorization.success ? 'Transactions catégorisées avec succès' : 'Erreur lors de la catégorisation'
    });
  } catch (err) {
    console.error('Erreur lors du traitement du fichier:', err);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier' },
      { status: 500 }
    );
  }
} 