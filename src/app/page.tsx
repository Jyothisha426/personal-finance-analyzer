'use client';

import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyExpensesChart from './components/Charts/MonthlyExpensesChart';
import CategoryPieChart from './components/Charts/CategoryPieChart';
import BudgetChart from './components/Charts/BudgetChart';
import Dashboard from './components/Dashboard';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const handleRefresh = (): void => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Personal Finance Visualizer
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Track, analyze, and optimize your spending
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Dashboard />
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <TransactionForm onTransactionAdded={handleRefresh} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <TransactionList refreshTrigger={refreshTrigger} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <MonthlyExpensesChart />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <CategoryPieChart />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <BudgetChart />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}