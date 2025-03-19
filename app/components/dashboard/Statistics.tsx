'use client';

import { useEffect, useState } from 'react';

interface StatisticsData {
  totalExpenses: number;
  totalIncome: number;
  currentBalance: number;
}

export default function Statistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 glass">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-white/40 p-4 glass">
        Aucune donnée disponible
      </div>
    );
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return '0,00 €';
    }
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="glass p-4">
        <h3 className="text-sm font-medium text-white/60 mb-2">Solde total</h3>
        <p className="text-2xl font-semibold text-white">
          {formatCurrency(data.currentBalance)}
        </p>
      </div>
      <div className="glass p-4">
        <h3 className="text-sm font-medium text-white/60 mb-2">Dépenses du mois</h3>
        <p className="text-2xl font-semibold text-red-400">
          {formatCurrency(data.totalExpenses)}
        </p>
      </div>
      <div className="glass p-4">
        <h3 className="text-sm font-medium text-white/60 mb-2">Revenus du mois</h3>
        <p className="text-2xl font-semibold text-emerald-400">
          {formatCurrency(data.totalIncome)}
        </p>
      </div>
      <div className="glass p-4 group relative">
        <h3 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
          Résultat du mois
          <span className="hidden group-hover:block absolute top-4 left-full ml-2 p-2 bg-slate-800 rounded-lg text-xs text-white/80 w-48 z-10">
            Différence entre les revenus et les dépenses du mois en cours
          </span>
        </h3>
        <p className={`text-2xl font-semibold ${data.totalIncome - data.totalExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatCurrency(data.totalIncome - data.totalExpenses)}
        </p>
      </div>
    </div>
  );
} 