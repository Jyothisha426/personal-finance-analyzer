'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string | Date;
  description?: string;
}

export default function Dashboard() {
  const [total, setTotal] = useState<number>(0);
  const [latest, setLatest] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/transactions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const transactions: Transaction[] = await response.json();
        const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);
        const sorted = [...transactions].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setTotal(totalExpense);
        setLatest(sorted.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm animate-pulse">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-3 text-indigo-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Expenses Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expenses</div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
            <span className="ml-2 text-sm text-gray-500">(all time)</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 md:col-span-2">
        <div className="p-6">
          <h3 className="text-gray-700 text-lg font-semibold mb-4">Recent Transactions</h3>
          {latest.length > 0 ? (
            <ul className="space-y-3">
              {latest.map((t) => (
                <li key={t._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      t.amount > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}></div>
                    <div>
                      <span className="font-medium text-gray-900">₹{Math.abs(t.amount).toLocaleString()}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600 capitalize">{t.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No recent transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}