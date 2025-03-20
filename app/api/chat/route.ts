import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface QueryAnalysis {
  timeRange?: {
    start: Date;
    end: Date;
  };
  type: 'balance' | 'expenses' | 'income' | 'transactions' | 'categories' | 'general';
  category?: string;
  limit?: number;
  aggregation?: 'sum' | 'average' | 'count';
}

interface PrismaQuery {
  where: {
    dateOp?: {
      gte?: Date;
      lte?: Date;
    };
    category?: string;
    amount?: {
      lt?: number;
      gt?: number;
    };
  };
  orderBy: {
    dateOp: 'desc';
  };
  select: {
    label: boolean;
    amount: boolean;
    dateOp: boolean;
    category: boolean;
  };
  take?: number;
}

async function analyzeQuestion(question: string): Promise<QueryAnalysis> {
  const analysisPrompt = `
En tant qu'expert en analyse de questions financières, analyse la question suivante et retourne une réponse JSON structurée.
Question: "${question}"

Retourne un objet JSON avec les propriétés suivantes :
{
  "timeRange": { // période concernée, null si non spécifié
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "type": "balance" | "expenses" | "income" | "transactions" | "categories" | "general",
  "category": "string ou null", // si la question concerne une catégorie spécifique
  "limit": number ou null, // nombre de transactions à retourner
  "aggregation": "sum" | "average" | "count" | null
}

Exemples:
"Quel est mon solde actuel ?" →
{
  "type": "balance",
  "timeRange": null,
  "category": null,
  "limit": null,
  "aggregation": "sum"
}

"Quelles sont mes dépenses en alimentation ce mois-ci ?" →
{
  "type": "expenses",
  "timeRange": { "start": "2024-03-01", "end": "2024-03-31" },
  "category": "alimentation",
  "limit": null,
  "aggregation": "sum"
}

Analyse la question et retourne UNIQUEMENT l'objet JSON, sans autre texte.`;

  const analysis = await openai.chat.completions.create({
    messages: [{ role: "user", content: analysisPrompt }],
    model: "gpt-3.5-turbo",
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const content = analysis.choices[0].message.content;
  if (!content) {
    throw new Error("Réponse invalide de l'API OpenAI");
  }

  try {
    return JSON.parse(content) as QueryAnalysis;
  } catch (error) {
    console.error("Erreur lors du parsing de la réponse:", error);
    // Retourner une analyse par défaut
    return {
      type: "general",
      timeRange: undefined,
      category: undefined,
      limit: undefined,
      aggregation: undefined
    };
  }
}

async function fetchRelevantData(analysis: QueryAnalysis) {
  const baseQuery: PrismaQuery = {
    where: {},
    orderBy: { dateOp: 'desc' },
    select: {
      label: true,
      amount: true,
      dateOp: true,
      category: true,
    },
  };

  // Ajouter les filtres de date
  if (analysis.timeRange) {
    baseQuery.where.dateOp = {
      gte: new Date(analysis.timeRange.start),
      lte: new Date(analysis.timeRange.end),
    };
  }

  // Ajouter le filtre de catégorie
  if (analysis.category) {
    baseQuery.where.category = analysis.category;
  }

  // Ajouter la limite
  if (analysis.limit) {
    baseQuery.take = analysis.limit;
  }

  // Adapter la requête selon le type
  switch (analysis.type) {
    case 'expenses':
      baseQuery.where.amount = { lt: 0 };
      break;
    case 'income':
      baseQuery.where.amount = { gt: 0 };
      break;
    case 'categories':
      return await prisma.transaction.groupBy({
        by: ['category'],
        _sum: { amount: true },
        where: baseQuery.where,
      });
  }

  const transactions = await prisma.transaction.findMany(baseQuery);

  // Calculer les agrégations si nécessaire
  if (analysis.aggregation) {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    switch (analysis.aggregation) {
      case 'sum':
        return { total };
      case 'average':
        return { average: total / transactions.length };
      case 'count':
        return { count: transactions.length };
    }
  }

  return transactions;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Étape 1: Analyser la question
    const analysis = await analyzeQuestion(message);

    // Étape 2: Récupérer les données pertinentes
    const data = await fetchRelevantData(analysis);

    // Étape 3: Générer la réponse
    const responsePrompt = `
En tant qu'assistant financier, analyse ces données et réponds à la question.

Question: "${message}"

Données: ${JSON.stringify(data, null, 2)}

Type d'analyse: ${analysis.type}
${analysis.category ? `Catégorie: ${analysis.category}` : ''}
${analysis.timeRange ? `Période: du ${analysis.timeRange.start} au ${analysis.timeRange.end}` : ''}

Réponds de manière concise et professionnelle en français. Si pertinent, suggère des conseils d'optimisation budgétaire.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: responsePrompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur API chat:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande.' },
      { status: 500 }
    );
  }
}
