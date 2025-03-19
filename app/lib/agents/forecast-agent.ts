import { prisma } from "../prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface PurchasePlan {
  itemName: string;
  targetPrice: number;
  currentBalance: number;
}

export async function analyzePurchaseFeasibility(plan: PurchasePlan) {
  try {
    // Récupérer les statistiques des 3 derniers mois
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: threeMonthsAgo
        }
      }
    });

    // Calculer les moyennes mensuelles
    const monthlyStats = transactions.reduce((acc, t) => {
      if (t.amount > 0) {
        acc.income += t.amount;
      } else {
        acc.expenses += Math.abs(t.amount);
      }
      return acc;
    }, { income: 0, expenses: 0 });

    monthlyStats.income /= 3;  // Moyenne mensuelle
    monthlyStats.expenses /= 3;

    const prompt = `En tant que conseiller financier, analyse la faisabilité de cet achat:

    Achat souhaité: ${plan.itemName}
    Prix cible: ${plan.targetPrice}€
    
    Situation financière:
    - Solde actuel: ${plan.currentBalance}€
    - Revenu mensuel moyen: ${monthlyStats.income.toFixed(2)}€
    - Dépenses mensuelles moyennes: ${monthlyStats.expenses.toFixed(2)}€
    
    Analyse et recommande:
    1. Si l'achat est raisonnable maintenant
    2. Le meilleur moment pour faire cet achat
    3. Des suggestions d'épargne si nécessaire
    4. Des risques potentiels à considérer

    Réponds avec un objet JSON:
    {
      "isFeasible": boolean,
      "recommendedDate": "string (YYYY-MM)",
      "savingRequired": number,
      "monthlySavingTarget": number,
      "risks": string[],
      "recommendations": string[]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    // Sauvegarder l'analyse
    await prisma.aIAnalysis.create({
      data: {
        type: 'forecast',
        content: JSON.stringify({
          item: plan.itemName,
          price: plan.targetPrice,
          analysis
        })
      }
    });

    return { success: true, analysis };
  } catch (error) {
    console.error('Erreur dans l\'agent de prévision:', error);
    return { success: false, error: 'Erreur lors de l\'analyse prévisionnelle' };
  }
} 