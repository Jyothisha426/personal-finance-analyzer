'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Transaction {
  _id: string;
  amount: number;
  date: string | Date;
  // other fields...
}

export default function MonthlyExpensesChart() {
  const [data, setData] = useState<{month: string, total: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/transactions');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transactions: Transaction[] = await response.json();

        if (!transactions || transactions.length === 0) {
          setData([]);
          return;
        }

        const grouped: { [month: string]: number } = {};
        
        transactions.forEach((t) => {
          try {
            const date = typeof t.date === 'string' ? new Date(t.date) : t.date;
            const month = date.toLocaleString('default', { 
              month: 'short', 
              year: 'numeric' 
            });
            grouped[month] = (grouped[month] || 0) + t.amount;
          } catch (e) {
            console.error('Error processing transaction:', t, e);
          }
        });

        const chartData = Object.entries(grouped)
          .map(([month, total]) => ({ 
            month, 
            total: Number(total.toFixed(2))
          }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load chart data');
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
        <p className="mt-3 text-indigo-600">Loading your spending data...</p>
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
          <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction data</h3>
      <p className="mt-1 text-sm text-gray-500">Start adding transactions to see your monthly spending</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Monthly Spending</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm text-gray-600">Total Expenses</span>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E7FF" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.5rem 1rem'
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Total']}
                labelFormatter={(label) => `Month: ${label}`}
                itemStyle={{ color: '#6366F1' }}
                labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
              />
              <Bar 
                dataKey="total" 
                fill="url(#colorTotal)"
                radius={[4, 4, 0, 0]}
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}