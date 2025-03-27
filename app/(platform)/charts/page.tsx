'use client';

import { Card } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import "react-datepicker/dist/react-datepicker.css";
import { AnalysisDisplay } from "../components/AnalysisDisplay";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyStats {
  currentMonth: {
    savings: number;
    expenses: number;
    income: number;
    savingsRatio: number;
    debtRatio: number;
    transactionCount: number;
    daysWithoutSpending: number;
  };
  changes: {
    savingsChange: number;
    expensesChange: number;
    debtChange: number;
    transactionCountChange: number;
    daysWithoutSpendingChange: number;
  };
  lastMonth: {
    transactionCount: number;
  };
  analysis?: {
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
  };
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpenseEvolution {
  categories: string[];
  data: {
    month: string;
    [key: string]: number | string;
  }[];
}

type PeriodType = 'month' | 'year' | 'custom';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export default function ChartsPage() {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Par défaut : dernier mois
    endDate: new Date()
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [expenseDistribution, setExpenseDistribution] = useState<ExpenseCategory[]>([]);
  const [expenseEvolution, setExpenseEvolution] = useState<ExpenseEvolution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataForPeriod = async (period: PeriodType, date?: DateRange | string | number) => {
    setIsLoading(true);
    try {
      let queryParams = '';
      
      if (period === 'custom' && date && typeof date !== 'string' && typeof date !== 'number') {
        queryParams = `?start=${date.startDate.toISOString()}&end=${date.endDate.toISOString()}`;
      } else if (period === 'month' && typeof date === 'string') {
        queryParams = `?month=${date}`;
      } else if (period === 'year' && typeof date === 'number') {
        queryParams = `?year=${date}`;
      }

      const [statsRes, distributionRes, evolutionRes] = await Promise.all([
        fetch(`/api/analytics/monthly-stats${queryParams}`),
        fetch(`/api/analytics/expenses-distribution${queryParams}`),
        fetch(`/api/analytics/expenses-evolution${queryParams}`),
      ]);

      const [stats, distribution, evolution] = await Promise.all([
        statsRes.json(),
        distributionRes.json(),
        evolutionRes.json(),
      ]);

      setMonthlyStats(stats);
      setExpenseDistribution(distribution);
      setExpenseEvolution(evolution);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors de l\'affichage des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (periodType === 'month') {
      fetchDataForPeriod('month', selectedMonth);
    } else if (periodType === 'year') {
      fetchDataForPeriod('year', selectedYear);
    } else if (periodType === 'custom') {
      fetchDataForPeriod('custom', customRange);
    }
  }, [periodType, selectedMonth, selectedYear, customRange]);

  // Configuration du graphique circulaire
  const doughnutData = {
    labels: expenseDistribution.map(item => item.category),
    datasets: [
      {
        data: expenseDistribution.map(item => item.amount),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(139, 92, 246, 0.8)', // Purple
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(245, 158, 11, 0.8)', // Amber
          'rgba(99, 102, 241, 0.8)', // Indigo
        ],
        borderWidth: 0,
      },
    ],
  };

  // Configuration du graphique en barres
  const barData = expenseEvolution ? {
    labels: expenseEvolution.data.map(item => item.month),
    datasets: expenseEvolution.categories.map((category, index) => ({
      label: category,
      data: expenseEvolution.data.map(item => item[category] as number),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ][index],
    })),
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%'
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    if (type === 'start') {
      if (newDate > customRange.endDate) {
        setCustomRange({
          startDate: newDate,
          endDate: newDate
        });
      } else {
        setCustomRange(prev => ({
          ...prev,
          startDate: newDate
        }));
      }
    } else {
      if (newDate < customRange.startDate) {
        setCustomRange({
          startDate: newDate,
          endDate: newDate
        });
      } else {
        setCustomRange(prev => ({
          ...prev,
          endDate: newDate
        }));
      }
    }
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    return minDate.toISOString().split('T')[0];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">Analyses graphiques</h1>
        <p className="text-sm sm:text-base text-white/60">Visualisez vos données financières en détail</p>
      </div>
      
      {/* Sélecteur de période */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as PeriodType)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm"
          >
            <option value="month">Par mois</option>
            <option value="year">Par année</option>
            <option value="custom">Période personnalisée</option>
          </select>
        </div>

        {periodType === 'month' && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="glass appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto [color-scheme:dark]"
            style={{
              colorScheme: 'dark'
            }}
          />
        )}

        {periodType === 'year' && (
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="glass appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto pr-8"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {periodType === 'custom' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-white/60 mb-1">Date de début</label>
              <input
                type="date"
                value={customRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('start', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="glass appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full [color-scheme:dark]"
                style={{
                  colorScheme: 'dark'
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-white/60 mb-1">Date de fin</label>
              <input
                type="date"
                value={customRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('end', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="glass appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full [color-scheme:dark]"
                style={{
                  colorScheme: 'dark'
                }}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
                  setCustomRange({
                    startDate: lastMonth,
                    endDate: new Date()
                  });
                }}
                className="glass bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white/80 text-sm transition-colors"
              >
                Dernier mois
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* KPIs mensuels */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <Card className="glass p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1 sm:mb-2">Taux d&apos;épargne</h3>
          <p className={`text-lg sm:text-2xl font-semibold ${
            monthlyStats?.currentMonth?.savingsRatio ? (
              Number(monthlyStats.currentMonth.savingsRatio) >= 15 ? 'text-emerald-400' : 
              Number(monthlyStats.currentMonth.savingsRatio) >= 10 ? 'text-purple-400' : 'text-red-400'
            ) : 'text-white/60'
          }`}>
            {monthlyStats?.currentMonth?.savingsRatio ? 
              `${(Number(monthlyStats.currentMonth.savingsRatio) || 0).toFixed(1)}%` : 
              '0.0%'
            }
          </p>
          <span className="text-[10px] sm:text-xs text-white/40">
            {monthlyStats?.changes?.savingsChange !== undefined ? (
              <>
                vs. mois dernier{' '}
                <span className={
                  Number(monthlyStats.changes.savingsChange) > 0 ? 'text-emerald-400' :
                  Number(monthlyStats.changes.savingsChange) < 0 ? 'text-red-400' : 'text-white/40'
                }>
                  {Number(monthlyStats.changes.savingsChange) > 0 ? '+' : ''}
                  {(Number(monthlyStats.changes.savingsChange) || 0).toFixed(1)}%
                </span>
              </>
            ) : '...'}
          </span>
        </Card>

        <Card className="glass p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1 sm:mb-2">Solde net mensuel</h3>
          <p className={`text-lg sm:text-2xl font-semibold ${
            monthlyStats?.currentMonth?.savings ? (
              Number(monthlyStats.currentMonth.savings) > 0 ? 'text-emerald-400' :
              Number(monthlyStats.currentMonth.savings) === 0 ? 'text-purple-400' : 'text-red-400'
            ) : 'text-white/60'
          }`}>
            {monthlyStats?.currentMonth?.savings ? 
              `${(Number(monthlyStats.currentMonth.savings) || 0).toFixed(0)}€` : 
              '0€'
            }
          </p>
          <span className="text-[10px] sm:text-xs text-white/40">
            {monthlyStats?.changes?.savingsChange !== undefined ? (
              <>
                vs. mois dernier{' '}
                <span className={
                  Number(monthlyStats.changes.savingsChange) > 0 ? 'text-emerald-400' :
                  Number(monthlyStats.changes.savingsChange) < 0 ? 'text-red-400' : 'text-white/40'
                }>
                  {Number(monthlyStats.changes.savingsChange) > 0 ? '+' : ''}
                  {(Number(monthlyStats.changes.savingsChange) || 0).toFixed(1)}%
                </span>
              </>
            ) : '...'}
          </span>
        </Card>

        <Card className="glass p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1 sm:mb-2">Nombre de transactions</h3>
          <p className={`text-lg sm:text-2xl font-semibold ${
            monthlyStats?.currentMonth?.transactionCount ? (
              Number(monthlyStats.currentMonth.transactionCount) <= 20 ? 'text-emerald-400' :
              Number(monthlyStats.currentMonth.transactionCount) <= 30 ? 'text-purple-400' : 'text-red-400'
            ) : 'text-white/60'
          }`}>
            {monthlyStats?.currentMonth?.transactionCount ? 
              Number(monthlyStats.currentMonth.transactionCount) || 0 : 
              '0'
            }
          </p>
          <span className="text-[10px] sm:text-xs text-white/40">
            {monthlyStats?.changes?.transactionCountChange !== undefined ? (
              <>
                vs. mois dernier{' '}
                <span className={
                  Number(monthlyStats.changes.transactionCountChange) < 0 ? 'text-emerald-400' :
                  Number(monthlyStats.changes.transactionCountChange) > 0 ? 'text-red-400' : 'text-white/40'
                }>
                  {Number(monthlyStats.changes.transactionCountChange) > 0 ? '+' : ''}
                  {Number(monthlyStats.changes.transactionCountChange)}
                </span>
              </>
            ) : '...'}
          </span>
        </Card>

        <Card className="glass p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-white/60 mb-1 sm:mb-2">Jours sans dépense</h3>
          <p className={`text-lg sm:text-2xl font-semibold ${
            monthlyStats?.currentMonth?.daysWithoutSpending ? (
              Number(monthlyStats.currentMonth.daysWithoutSpending) >= 10 ? 'text-emerald-400' :
              Number(monthlyStats.currentMonth.daysWithoutSpending) >= 5 ? 'text-purple-400' : 'text-red-400'
            ) : 'text-white/60'
          }`}>
            {monthlyStats?.currentMonth?.daysWithoutSpending ? 
              `${Number(monthlyStats.currentMonth.daysWithoutSpending) || 0}j` : 
              '0j'
            }
          </p>
          <span className="text-[10px] sm:text-xs text-white/40">
            {monthlyStats?.changes?.daysWithoutSpendingChange !== undefined ? (
              <>
                vs. mois dernier{' '}
                <span className={
                  Number(monthlyStats.changes.daysWithoutSpendingChange) > 0 ? 'text-emerald-400' :
                  Number(monthlyStats.changes.daysWithoutSpendingChange) < 0 ? 'text-red-400' : 'text-white/40'
                }>
                  {Number(monthlyStats.changes.daysWithoutSpendingChange) > 0 ? '+' : ''}
                  {Number(monthlyStats.changes.daysWithoutSpendingChange) || 0}j
                </span>
              </>
            ) : '...'}
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {/* Répartition des dépenses */}
        <Card className="glass p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white/80 mb-4 sm:mb-6">Répartition des dépenses</h3>
          <div className="h-[250px] sm:h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-white/60">Chargement...</p>
              </div>
            ) : expenseDistribution.length > 0 ? (
              <Doughnut data={doughnutData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-white/60">Aucune donnée disponible</p>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {expenseDistribution.slice(0, 4).map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{
                    backgroundColor: doughnutData.datasets[0].backgroundColor[
                      expenseDistribution.findIndex(d => d.category === item.category)
                    ],
                  }}></div>
                  <span className="text-xs sm:text-sm text-white/60">{item.category}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/80">{item.amount.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Évolution des dépenses par catégorie */}
        <Card className="glass p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white/80 mb-4 sm:mb-6">Évolution par catégorie</h3>
          <div className="h-[250px] sm:h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-white/60">Chargement...</p>
              </div>
            ) : barData ? (
              <Bar data={barData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-white/60">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Prévisions et tendances */}
        <Card className="glass p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white/80 mb-4 sm:mb-6">Prévisions financières</h3>
          {isLoading ? (
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
              <p className="text-sm text-white/60">Chargement...</p>
            </div>
          ) : monthlyStats?.analysis ? (
            <AnalysisDisplay analysis={monthlyStats.analysis} />
          ) : (
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
              <p className="text-sm text-white/60">Aucune analyse disponible</p>
            </div>
          )}
        </Card>

        {/* Objectifs d'épargne */}
        <Card className="glass p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white/80 mb-4 sm:mb-6">Suivi des objectifs</h3>
          <div className="h-[250px] sm:h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-white/60">Épargne vacances</span>
                  <span className="text-xs sm:text-sm font-medium text-white/80">1 500 € / 2 000 €</span>
                </div>
                <div className="h-1.5 sm:h-2 rounded-full bg-white/5">
                  <div className="h-full w-[75%] rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-white/60">Achat voiture</span>
                  <span className="text-xs sm:text-sm font-medium text-white/80">5 000 € / 15 000 €</span>
                </div>
                <div className="h-1.5 sm:h-2 rounded-full bg-white/5">
                  <div className="h-full w-[33%] rounded-full bg-blue-500"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-white/60">Fonds d&apos;urgence</span>
                  <span className="text-xs sm:text-sm font-medium text-white/80">3 000 € / 5 000 €</span>
                </div>
                <div className="h-1.5 sm:h-2 rounded-full bg-white/5">
                  <div className="h-full w-[60%] rounded-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="text-red-500">
          Erreur lors de l&apos;affichage des données
        </div>
      )}

      <div className="text-sm text-gray-500">
        Évolution sur l&apos;année
      </div>
    </div>
  );
} 