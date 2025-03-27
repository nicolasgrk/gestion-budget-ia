'use client';

import Statistics from '../components/dashboard/Statistics';
import QuickActions from '../components/dashboard/QuickActions';
import { Card } from "@/components/ui/card";
import BalanceChart from '../components/dashboard/BalanceChart';

export default function DashboardPage() {

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">Tableau de bord financier</h1>
        <p className="text-sm sm:text-base text-white/60">Gérez vos finances intelligemment</p>
      </div>

      <div className="mb-6 lg:mb-8">
        <Statistics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="lg:col-span-2">
          <Card className="glass p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white/80 mb-3 sm:mb-4">Évolution du solde</h3>
            <div className="h-[300px] sm:h-[400px]">
              <BalanceChart />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div> 
       </div>


    </div>
  );
}
