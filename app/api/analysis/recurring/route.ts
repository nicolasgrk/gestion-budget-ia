import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
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

    const prompt = `En tant qu'analyste financier, identifie les paiements récurrents dans cette liste de transactions:

    Transactions:
    ${transactions.map(t => `- ${t.label}: ${t.amount}€ (${t.dateOp})`).join('\n')}

    Identifie:
    1. Les paiements mensuels réguliers (abonnements, loyer, etc.)
    2. Les paiements récurrents mais irréguliers (courses, essence, etc.)
    3. Le montant moyen pour chaque type de paiement récurrent

    Réponds avec un objet JSON:
    {
      "monthlyPayments": [
        { "label": "string", "amount": number, "frequency": "mensuel" }
      ],
      "irregularPayments": [
        { "label": "string", "averageAmount": number, "frequency": "variable" }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    // Sauvegarder l'analyse
    await prisma.aIAnalysis.create({
      data: {
        type: 'recurring',
        content: JSON.stringify(analysis)
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Détection des paiements récurrents terminée',
      analysis
    });
  } catch (error) {
    console.error('Erreur API paiements récurrents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la détection des paiements récurrents' }, 
      { status: 500 }
    );
  }
} 