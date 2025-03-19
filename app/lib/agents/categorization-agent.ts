import OpenAI from 'openai';
import { prisma } from '../prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface CategoryResult {
  category: string;
  categoryParent: string;
}

export async function categorizationAgent() {
  try {
    // Récupérer les transactions non catégorisées
    const uncategorizedTransactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { category: null },
          { categoryParent: null }
        ]
      }
    });

    for (const transaction of uncategorizedTransactions) {
      const prompt = `Tu es un expert en finance personnelle et tu dois catégoriser cette transaction bancaire :

➡️ **Transaction** : "${transaction.label}"

📌 **Règles :**
1️⃣ **Détermine d'abord une catégorie parent** parmi :
   - Financier, Revenu, Alimentation, Transport, Logement, Santé, Divertissement, Achats, Éducation, Voyages, Services, Autres
2️⃣ **Détermine ensuite une sous-catégorie précise** (ex: "Banques", "Supermarchés", "Essence", "Médecin").
3️⃣ **Réponds uniquement sous ce format (catégorie_parent | sous_catégorie)**  
   Exemple : \`Financier | Banques\` ou \`Alimentation | Restaurants\`
4️⃣ **Ne donne aucune explication, juste le format demandé.**

✏️ **Réponse :**`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
      });

      try {
        const response = completion.choices[0].message.content?.trim() || "";
        const [categoryParent, category] = response.split("|").map(s => s.trim());
        
        if (categoryParent && category) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              category,
              categoryParent
            }
          });

          // Mettre à jour ou créer la catégorie
          await prisma.category.upsert({
            where: { name: category },
            update: { parentName: categoryParent },
            create: {
              name: category,
              parentName: categoryParent
            }
          });
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de la transaction ${transaction.id}:`, error);
        continue;
      }
    }

    return { success: true, message: `${uncategorizedTransactions.length} transactions catégorisées` };
  } catch (error) {
    console.error('Erreur dans l\'agent de catégorisation:', error);
    return { success: false, error: 'Erreur lors de la catégorisation' };
  }
}

export async function categorizeTransaction(label: string): Promise<string> {
  // Logique de catégorisation basée sur le libellé
  const categories = {
    'Alimentation': ['CARREFOUR', 'AUCHAN', 'LECLERC', 'LIDL', 'INTERMARCHE', 'PICARD'],
    'Transport': ['SNCF', 'RATP', 'UBER', 'TOTAL', 'ESSENCE', 'AUTOROUTE'],
    'Logement': ['LOYER', 'EDF', 'ENGIE', 'EAU', 'ASSURANCE HAB'],
    'Loisirs': ['FNAC', 'DECATHLON', 'NETFLIX', 'SPOTIFY', 'CINEMA'],
    'Santé': ['PHARMACIE', 'MEDECIN', 'MUTUELLE'],
    'Shopping': ['AMAZON', 'ZALANDO', 'ASOS', 'H&M', 'ZARA']
  };

  const upperLabel = label.toUpperCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => upperLabel.includes(keyword.toUpperCase()))) {
      return category;
    }
  }

  return 'Non catégorisé';
} 