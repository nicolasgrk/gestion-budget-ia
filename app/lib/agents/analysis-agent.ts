import { prisma } from "../prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeSpending() {
  try {
    // Récupérer toutes les transactions des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        dateOp: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        dateOp: 'desc'
      }
    });

    // Préparer les données pour l'analyse
    const totalSpent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const spendingByCategory = transactions
      .filter(t => t.amount < 0)
      .reduce((acc: Record<string, number>, t) => {
        const category = t.categoryParent || 'Non catégorisé';
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});

    const prompt = ` En tant qu'analyste financier expérimenté, analyse les dépenses des 30 derniers jours en tenant compte des données suivantes :

    Dépenses totales: ${totalSpent.toFixed(2)}€
    
    Données :
    Dépenses totales :
    Répartition par catégorie:
    ${Object.entries(spendingByCategory)
      .map(([category, amount]) => `${category}: ${amount.toFixed(2)}€`)
      .join('\n')}

    Format de réponse attendu (JSON) :
    {
      "tendances": {
        "titre": "Tendances principales",
        "description": "Description des tendances de dépenses majeures",
        "categories": [
          {
            "nom": "Nom de la catégorie",
            "montant": "Montant",
            "pourcentage": "Pourcentage",
            "variation": "Variation par rapport au mois précédent"
          }
        ]
      },
      "optimisations": {
        "titre": "Optimisations suggérées",
        "suggestions": [
          {
            "categorie": "Nom de la catégorie",
            "montant": "Montant potentiel d'économie",
            "description": "Description de l'optimisation"
          }
        ]
      },
      "habitudes": {
        "titre": "Habitudes de dépenses",
        "tags": ["tag1", "tag2", "tag3"],
        "description": "Description du profil financier"
      },
      "suggestions": {
        "titre": "Suggestions stratégiques",
        "actions": [
          {
            "titre": "Titre de l'action",
            "description": "Description détaillée",
            "montant": "Montant si applicable"
          }
        ]
      }
    }

    Attentes de l'analyse :
    Tendances principales : Identifie les tendances de dépenses majeures, les pics et creux éventuels, et toute évolution notable par rapport à un mois classique.
    Analyse des catégories dominantes : Mets en évidence les catégories les plus coûteuses, explique pourquoi ces dépenses pourraient être élevées et si elles semblent récurrentes ou ponctuelles.
    Optimisation et économies : Propose des recommandations concrètes et applicables pour réduire les coûts, en tenant compte des habitudes observées.
    Habitudes de dépenses et comportement financier : Donne un aperçu du profil financier basé sur ces dépenses (ex. : prudent, impulsif, axé sur le confort, prévoyant, etc.).
    Suggestions stratégiques : Fournis des pistes d'amélioration à long terme, comme des stratégies d'investissement, des ajustements budgétaires ou des outils de gestion des finances personnelles qui pourraient aider à mieux optimiser ces dépenses.
    Rends ton analyse détaillée mais concise, avec des insights pertinents et des recommandations actionnables.
    
    IMPORTANT: Ta réponse doit être un objet JSON valide suivant exactement le format spécifié ci-dessus.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const analysis = completion.choices[0].message.content;
    if (!analysis) {
      return { success: false, error: 'Aucune analyse disponible' };
    }

    // Sauvegarder l'analyse
    await prisma.aIAnalysis.create({
      data: {
        type: 'spending',
        content: analysis
      }
    });

    return { success: true, analysis: JSON.parse(analysis) };
  } catch (error) {
    console.error('Erreur dans l\'agent d\'analyse:', error);
    return { success: false, error: 'Erreur lors de l\'analyse des dépenses' };
  }
} 