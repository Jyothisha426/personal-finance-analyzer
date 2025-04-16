'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((transactions) => {
        const totalExpense = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
        const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTotal(totalExpense);
        setLatest(sorted.slice(0, 3));
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Expenses Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expenses</div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
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
                  <div>
                    <span className="font-medium text-gray-900">₹{t.amount.toLocaleString()}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 capitalize">{t.category}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}