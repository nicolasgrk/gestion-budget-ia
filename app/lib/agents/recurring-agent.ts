import OpenAI from 'openai';
import { PrismaClient, Transaction } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface RecurringAnalysisResult {
  isRecurring: boolean;
  confidence: number;
  frequency: 'mensuel' | 'hebdomadaire' | 'annuel' | 'inconnu';
  explanation: string;
}

interface RecurringPayment {
  label: string;
  frequency: string;
  amount: number;
  explanation: string;
}

export async function detectRecurringPayments() {
  try {
    // Récupérer les transactions des 3 derniers mois
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: threeMonthsAgo
        }
      },
      orderBy: {
        dateOp: 'desc'
      }
    });

    // Grouper les transactions par label similaire
    const groupedTransactions: Record<string, Transaction[]> = {};
    
    transactions.forEach((transaction: Transaction) => {
      const key = transaction.label.toLowerCase().trim();
      if (!groupedTransactions[key]) {
        groupedTransactions[key] = [];
      }
      groupedTransactions[key].push(transaction);
    });

    // Identifier les paiements potentiellement récurrents
    const recurringPayments: RecurringPayment[] = [];
    
    for (const [label, group] of Object.entries(groupedTransactions)) {
      if (group.length >= 2) {
        const amounts = group.map(t => t.amount);
        const uniqueAmounts = new Set(amounts);
        
        if (uniqueAmounts.size <= 2) { // Permettre une légère variation dans les montants
          const prompt = `Analyse cette série de transactions pour déterminer si elle représente un paiement récurrent:

          Label: ${label}
          Montants: ${amounts.join(', ')}€
          Dates: ${group.map(t => t.dateOp.toISOString().split('T')[0]).join(', ')}

          Est-ce que cela semble être un paiement récurrent ? Réponds uniquement par un objet JSON:
          {
            "isRecurring": boolean,
            "confidence": number (0-1),
            "frequency": "mensuel"|"hebdomadaire"|"annuel"|"inconnu",
            "explanation": "string"
          }`;

          const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.3,
          });

          const result = JSON.parse(completion.choices[0].message.content || "{}") as RecurringAnalysisResult;
          
          if (result.isRecurring && result.confidence > 0.7) {
            // Marquer les transactions comme récurrentes
            for (const transaction of group) {
              await prisma.transaction.update({
                where: { id: transaction.id },
                data: { isRecurring: true }
              });
            }

            recurringPayments.push({
              label,
              frequency: result.frequency,
              amount: Math.abs(amounts[0]),
              explanation: result.explanation
            });
          }
        }
      }
    }

    // Sauvegarder l'analyse
    if (recurringPayments.length > 0) {
      await prisma.aIAnalysis.create({
        data: {
          type: 'recurring',
          content: JSON.stringify(recurringPayments)
        }
      });
    }

    return { success: true, recurringPayments };
  } catch (error) {
    console.error('Erreur dans l\'agent de détection des paiements récurrents:', error);
    return { success: false, error: 'Erreur lors de la détection' };
  }
} 