'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = [
  '#6366F1', // indigo
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316'  // orange
];

export default function CategoryPieChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

        const grouped: { [category: string]: number } = {};
        
        transactions.forEach((t) => {
          try {
            const category = t.category || 'Uncategorized';
            grouped[category] = (grouped[category] || 0) + t.amount;
          } catch (e) {
            console.error('Error processing transaction:', t, e);
          }
        });

        const chartData = Object.entries(grouped)
          .map(([name, value]) => ({ 
            name, 
            value: Number(value.toFixed(2)) 
          }))
          .sort((a, b) => b.value - a.value);

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
        <p className="mt-3 text-indigo-600">Analyzing your spending...</p>
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
      <h3 className="mt-2 text-sm font-medium text-gray-900">No spending data</h3>
      <p className="mt-1 text-sm text-gray-500">Add transactions to see category breakdown</p>
    </div>
  );

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Spending by Category</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm text-gray-600">Expense Distribution</span>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={color} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.3}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
                animationBegin={100}
                animationDuration={1000}
                animationEasing="ease-out"
                label={({ name, percent, index }) => (
                  activeIndex === index || activeIndex === null ? (
                    <text 
                      x={0} 
                      y={0} 
                      textAnchor="middle" 
                      dominantBaseline="central"
                      fill="#1E293B"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  ) : null
                )}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index % COLORS.length})`}
                    stroke="#fff"
                    strokeWidth={activeIndex === index ? 2 : 1}
                    style={{
                      filter: activeIndex === index ? 'drop-shadow(0px 0px 5px rgba(99, 102, 241, 0.5))' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>

              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.75rem 1rem'
                }}
                formatter={(value: number, name: string) => {
                    const total = data.reduce((sum, item) => sum + item.value, 0);
                    const percent = calculatePercentage(value, total);
                    return [
                      `₹${value.toFixed(2)}`,
                      `${name} (${percent}%)`
                    ];
                  }}
                itemStyle={{ 
                  color: '#1E293B',
                  fontWeight: 500
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry, index) => (
                  <span className="text-xs text-gray-600">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}