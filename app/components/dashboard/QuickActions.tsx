'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/card';
import { Upload } from 'lucide-react';

interface RecurringPayment {
  label: string;
  amount?: number;
  averageAmount?: number;
  frequency: string;
}

interface PurchasePlanResult {
  isFeasible: boolean;
  recommendedDate: string;
  savingRequired: number;
  monthlySavingTarget: number;
  risks: string[];
  recommendations: string[];
}

interface AnalysisData {
  tendances: {
    titre: string;
    description: string;
    categories: Array<{
      nom: string;
      montant: string;
      pourcentage: string;
      variation: string;
    }>;
  };
  optimisations: {
    titre: string;
    suggestions: Array<{
      categorie: string;
      montant: string;
      description: string;
    }>;
  };
  habitudes: {
    titre: string;
    tags: string[];
    description: string;
  };
  suggestions: {
    titre: string;
    actions: Array<{
      titre: string;
      description: string;
      montant?: string;
    }>;
  };
}

export default function QuickActions() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);
  
  // États pour les modaux
  const [showSpendingModal, setShowSpendingModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // États pour les résultats
  const [spendingAnalysis, setSpendingAnalysis] = useState<string | AnalysisData | null>(null);
  const [recurringPayments, setRecurringPayments] = useState<{
    monthlyPayments: RecurringPayment[];
    irregularPayments: RecurringPayment[];
  } | null>(null);
  const [purchasePlan, setPurchasePlan] = useState<PurchasePlanResult | null>(null);

  // État pour le formulaire d'achat
  const [purchaseForm, setPurchaseForm] = useState({
    itemName: '',
    targetPrice: '',
    currentBalance: ''
  });

  const handleAnalyzeSpending = async () => {
    setIsLoading('analyze');
    setMessage(null);
    try {
      const response = await fetch('/api/analysis/spending', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l&apos;analyse des dépenses');
      }

      const data = await response.json();
      if (typeof data.analysis === 'string') {
        setSpendingAnalysis(data.analysis);
      } else {
        setSpendingAnalysis(data.analysis);
      }
      setShowSpendingModal(true);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleDetectRecurring = async () => {
    setIsLoading('recurring');
    setMessage(null);
    try {
      const response = await fetch('/api/analysis/recurring', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la détection des paiements récurrents');
      }

      const data = await response.json();
      setRecurringPayments(data.analysis);
      setShowRecurringModal(true);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handlePurchasePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('plan');
    setMessage(null);
    try {
      const response = await fetch('/api/analysis/purchase-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: purchaseForm.itemName,
          targetPrice: parseFloat(purchaseForm.targetPrice),
          currentBalance: parseFloat(purchaseForm.currentBalance)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la planification de l&apos;achat');
      }

      const data = await response.json();
      setPurchasePlan(data.analysis);
      setShowPurchaseModal(true);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading('upload');
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transactions/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l&apos;import du fichier CSV');
      }

      const data = await response.json();
      setMessage({
        type: 'success',
        content: `${data.count} transactions importées avec succès. ${data.categorization}`
      });
      setShowUploadModal(false);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Une erreur est survenue lors de l&apos;import'
      });
    } finally {
      setIsLoading(null);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <>
      <Card className="h-[400px] sm:h-[400px]">
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium text-white/80">Actions rapides</h3>
          
          <button
            onClick={handleAnalyzeSpending}
            disabled={isLoading !== null}
            className="w-full p-2 sm:p-3 rounded-xl glass glass-hover disabled:opacity-50 text-left text-xs sm:text-base"
          >
            <span className="line-clamp-2 sm:line-clamp-1">
              {isLoading === 'analyze' ? 'Analyse en cours...' : 'Analyser mes dépenses'}
            </span>
          </button>
          
          <button
            onClick={handleDetectRecurring}
            disabled={isLoading !== null}
            className="w-full p-2 sm:p-3 rounded-xl glass glass-hover disabled:opacity-50 text-left text-xs sm:text-base"
          >
            <span className="line-clamp-2 sm:line-clamp-1">
              {isLoading === 'recurring' ? 'Détection en cours...' : 'Détecter les paiements récurrents'}
            </span>
          </button>
          
          <button
            onClick={() => setShowPurchaseModal(true)}
            disabled={isLoading !== null}
            className="w-full p-2 sm:p-3 rounded-xl glass glass-hover disabled:opacity-50 text-left text-xs sm:text-base"
          >
            <span className="line-clamp-2 sm:line-clamp-1">
              Planifier un achat
            </span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            disabled={isLoading !== null}
            className="w-full p-2 sm:p-3 rounded-xl glass glass-hover disabled:opacity-50 text-left text-xs sm:text-base flex items-center justify-between"
          >
            <span className="line-clamp-2 sm:line-clamp-1">
              {isLoading === 'upload' ? 'Import en cours...' : 'Importer un relevé CSV'}
            </span>
            <Upload className="w-4 h-4 text-white/60" />
          </button>

          {message && (
            <div className={`p-2 sm:p-3 rounded-xl text-xs sm:text-sm ${
              message.type === 'success' 
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100' 
                : 'bg-red-500/20 border border-red-500/30 text-red-100'
            }`}>
              {message.content}
            </div>
          )}
        </div>
      </Card>

      {/* Modals avec le même style */}
      <Modal
        isOpen={showSpendingModal}
        onClose={() => setShowSpendingModal(false)}
        title="Analyse des dépenses"
      >
        <div className="prose prose-invert">
          {spendingAnalysis ? (
            <div className="text-white/90 space-y-4">
              {/* Tendances */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400">{(spendingAnalysis as AnalysisData).tendances.titre}</h4>
                <p className="text-sm text-white/80">{(spendingAnalysis as AnalysisData).tendances.description}</p>
                <div className="space-y-1 mt-2">
                  {(spendingAnalysis as AnalysisData).tendances.categories.map((cat, index) => (
                    <div key={index} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/75">{cat.nom}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/75">{cat.montant} ({cat.pourcentage})</span>
                        <span className={`text-xs ${
                          cat.variation.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {cat.variation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Optimisations */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400">{(spendingAnalysis as AnalysisData).optimisations.titre}</h4>
                <div className="space-y-1 mt-2">
                  {(spendingAnalysis as AnalysisData).optimisations.suggestions.map((opt, index) => (
                    <div key={index} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/75">{opt.categorie}</span>
                      <div>
                        <span className="text-white/75">{opt.description}</span>
                        <span className="font-medium text-emerald-400 ml-2">{opt.montant}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Habitudes */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400">{(spendingAnalysis as AnalysisData).habitudes.titre}</h4>
                <p className="text-sm text-white/80 mb-2">{(spendingAnalysis as AnalysisData).habitudes.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {(spendingAnalysis as AnalysisData).habitudes.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        index % 3 === 0 ? 'bg-purple-500/20 text-purple-400' :
                        index % 3 === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Suggestions */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400">{(spendingAnalysis as AnalysisData).suggestions.titre}</h4>
                <div className="space-y-1 mt-2">
                  {(spendingAnalysis as AnalysisData).suggestions.actions.map((act, index) => (
                    <div key={index} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/75">{act.titre}</span>
                      <div>
                        <span className="text-white/75">{act.description}</span>
                        {act.montant && (
                          <span className="font-medium text-emerald-400 ml-2">{act.montant}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/75">Aucune analyse disponible</p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        title="Paiements récurrents"
      >
        {recurringPayments ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-3">Paiements mensuels</h3>
              <div className="space-y-2">
                {recurringPayments.monthlyPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/75">{payment.label}</span>
                    <span className="font-medium text-white">{payment.amount?.toFixed(2) || 'N/A'}€</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-3">Paiements irréguliers</h3>
              <div className="space-y-2">
                {recurringPayments.irregularPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/75">{payment.label}</span>
                    <span className="font-medium text-white">~{payment.averageAmount?.toFixed(2) || 'N/A'}€</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white/75">Aucun paiement récurrent détecté</p>
        )}
      </Modal>

      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Planifier un achat"
      >
        {!purchasePlan ? (
          <form onSubmit={handlePurchasePlanSubmit} className="space-y-4">
            <div>
              <div className="block text-xs sm:text-sm font-medium text-white/90 mb-2">
                Que souhaitez-vous acheter ?
              </div>
              <input
                type="text"
                value={purchaseForm.itemName}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, itemName: e.target.value }))}
                className="w-full p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: Nouveau téléphone"
                required
              />
            </div>

            <div>
              <div className="block text-xs sm:text-sm font-medium text-white/90 mb-2">
                Prix estimé
              </div>
              <input
                type="number"
                value={purchaseForm.targetPrice}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, targetPrice: e.target.value }))}
                className="w-full p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: 800"
                required
              />
            </div>

            <div>
              <div className="block text-xs sm:text-sm font-medium text-white/90 mb-2">
                Épargne actuelle
              </div>
              <input
                type="number"
                value={purchaseForm.currentBalance}
                onChange={(e) => setPurchaseForm(prev => ({ ...prev, currentBalance: e.target.value }))}
                className="w-full p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex: 300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading === 'plan'}
              className="w-full p-2 sm:p-3 rounded-xl glass glass-hover disabled:opacity-50 text-xs sm:text-sm text-white/90"
            >
              {isLoading === 'plan' ? 'Analyse en cours...' : 'Analyser la faisabilité'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="font-medium text-white/90 mb-2">
                Faisabilité : {purchasePlan.isFeasible ? 
                  <span className="text-emerald-400">Possible</span> : 
                  <span className="text-red-400">Difficile</span>
                }
              </p>
              <p className="text-white/75">Date recommandée : {purchasePlan.recommendedDate}</p>
              <p className="text-white/75">Épargne nécessaire : {purchasePlan.savingRequired.toFixed(2)}€</p>
              <p className="text-white/75">Objectif d&apos;épargne mensuel : {purchasePlan.monthlySavingTarget.toFixed(2)}€</p>
            </div>

            <div>
              <h4 className="font-medium text-white/90 mb-3">Points d&apos;attention :</h4>
              <ul className="space-y-2">
                {purchasePlan.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/75">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white/90 mb-3">Recommandations :</h4>
              <ul className="space-y-2">
                {purchasePlan.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/75">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setPurchasePlan(null);
                setPurchaseForm({ itemName: '', targetPrice: '', currentBalance: '' });
              }}
              className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 text-white"
            >
              Planifier un autre achat
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Importer un relevé CSV"
      >
        <div className="space-y-4">
          <p className="text-white/75 text-sm">
            Sélectionnez votre fichier CSV contenant vos transactions bancaires.
            Le fichier doit contenir les colonnes : date, libellé, montant.
          </p>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-white/60" />
                <p className="mb-2 text-sm text-white/90">
                  <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez-déposez
                </p>
                <p className="text-xs text-white/60">CSV uniquement</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isLoading !== null}
              />
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
} 