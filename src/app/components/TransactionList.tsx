'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiEdit, FiRefreshCw } from 'react-icons/fi';

interface Transaction {
  _id: string;
  amount: number;
  date: string | Date;
  description: string;  
  category: string;
}

interface TransactionListProps {
    refreshTrigger: boolean;
  }

export default function TransactionList({ refreshTrigger }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);


  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setDeletingId(id);
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  if (transactions.length === 0) return (
    <div className="text-center py-8">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding a new transaction.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Transactions</h2>
          <button 
            onClick={fetchTransactions}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <FiRefreshCw className="mr-1" /> Refresh
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.map((t) => (
            <div key={t._id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.category === 'Food' ? 'bg-green-100 text-green-800' :
                      t.category === 'Transport' ? 'bg-blue-100 text-blue-800' :
                      t.category === 'Shopping' ? 'bg-purple-100 text-purple-800' :
                      t.category === 'Bills' ? 'bg-red-100 text-red-800' :
                      t.category === 'Health' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t.category}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">₹{t.amount.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{t.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(t.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <FiEdit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTransaction(t._id)}
                    disabled={deletingId === t._id}
                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingId === t._id ? (
                      <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FiTrash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}