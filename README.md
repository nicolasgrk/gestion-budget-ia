# Application de Gestion de Budget avec IA

Cette application utilise l'intelligence artificielle pour vous aider à gérer votre budget en analysant vos transactions bancaires.

## Fonctionnalités

- Import de relevés bancaires CSV
- Catégorisation automatique des dépenses par IA
- Analyse des dépenses avec suggestions
- Détection des paiements récurrents
- Chatbot financier personnalisé
- Planification d'achats avec analyse de faisabilité
- Interface utilisateur moderne et responsive

## Technologies utilisées

- Next.js 14 (React)
- TypeScript
- Prisma (ORM)
- MySQL
- OpenAI API
- Clerk (Authentification)
- TailwindCSS
- ShadcnUI

## Prérequis

- Node.js 18+
- MySQL
- Compte Clerk
- Clé API OpenAI

## Installation

1. Clonez le dépôt :
```bash
git clone [url-du-repo]
cd gestion-budget-ai
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env` à la racine du projet avec :
```
DATABASE_URL="mysql://user:password@localhost:3306/gestion_budget_ai"
OPENAI_API_KEY="votre-clé-api-openai"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="votre-clé-publique-clerk"
CLERK_SECRET_KEY="votre-clé-secrète-clerk"
```

4. Initialisez la base de données :
```bash
npx prisma db push
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

## Structure des fichiers CSV

L'application attend des fichiers CSV avec les colonnes suivantes :
- dateOp: Date de l'opération
- dateVal: Date de valeur
- label: Libellé de la transaction
- category: Catégorie (optionnel)
- categoryParent: Catégorie parent (optionnel)
- supplierFound: Fournisseur identifié
- amount: Montant
- comment: Commentaire (optionnel)
- accountNum: Numéro de compte
- accountLabel: Libellé du compte
- accountbalance: Solde du compte

## Utilisation des agents IA

### Agent de catégorisation
- Analyse automatiquement les nouvelles transactions
- Attribue des catégories et sous-catégories
- Apprend des corrections manuelles

### Agent d'analyse
- Analyse les tendances de dépenses
- Fournit des recommandations d'économies
- Identifie les anomalies

### Agent de paiements récurrents
- Détecte les paiements réguliers
- Calcule les montants moyens
- Prévoit les prochaines échéances

### Chatbot financier
- Répond aux questions sur vos finances
- Fournit des analyses personnalisées
- Aide à la planification budgétaire

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT
