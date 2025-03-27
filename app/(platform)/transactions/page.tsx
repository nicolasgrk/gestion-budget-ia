'use client';

import { TransactionsTable } from "../components/transactions/TransactionsTable";

export default function TransactionsPage() {

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">Transactions</h1>
        <p className="text-sm sm:text-base text-white/60">Gérez et modifiez vos transactions</p>
      </div>

      <TransactionsTable />
    </div>
  );
} 