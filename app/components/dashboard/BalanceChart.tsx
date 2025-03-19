'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false
});

interface BalanceData {
  month: number;
  balance: number | null;
}

interface YearData {
  year: number;
  data: BalanceData[];
}

interface ChartApiResponse {
  currentYear: YearData;
  lastYear: YearData;
}

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function BalanceChart() {
  const [chartData, setChartData] = useState<ChartApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statistics/balance-evolution');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Chargement du graphique...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Aucune donnée disponible
      </div>
    );
  }

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: `Solde ${chartData.currentYear.year}`,
        data: chartData.currentYear.data.map(item => item.balance),
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: `Solde ${chartData.lastYear.year}`,
        data: chartData.lastYear.data.map(item => item.balance),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            if (context.parsed.y !== null) {
              return context.parsed.y.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              });
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          callback: function(value: number | string) {
            if (typeof value === 'number') {
              return value.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              });
            }
            return '';
          },
        },
      },
    },
  } as const;

  return (
    <div className="h-full w-full">
      <LineChart data={data} options={options} />
    </div>
  );
} 