import React, { useState } from 'react';
import { useStore } from '../store/store';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface BudgetFormData {
  category: string;
  amount: string;
  period: string;
}

export const Budgets = () => {
  const budgets = useStore((state) => state.budgets);
  const transactions = useStore((state) => state.transactions);
  const addBudget = useStore((state) => state.addBudget);
  const updateBudget = useStore((state) => state.updateBudget);
  const deleteBudget = useStore((state) => state.deleteBudget);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BudgetFormData>({
    category: '',
    amount: '',
    period: 'monthly',
  });

  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
    };

    if (editingId) {
      updateBudget(editingId, budgetData);
      setEditingId(null);
    } else {
      addBudget(budgetData);
    }

    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
    });
    setIsAdding(false);
  };

  const handleEdit = (budget: any) => {
    setEditingId(budget.id);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  // Calculate spent for a category (for demo, sum all negative transactions in that category)
  const calculateSpent = (category: string) => {
    return transactions
      .filter((t) => t.category === category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-500 rounded-b-3xl px-4 pt-8 pb-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl shadow p-4 mb-6 mx-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Period</label>
                <select
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {editingId ? 'Update' : 'Add'} Budget
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      <div className="mx-4">
        <ul role="list" className="divide-y divide-gray-100 bg-white rounded-2xl shadow">
          {budgets.map((budget) => {
            const spent = calculateSpent(budget.category);
            const progressColor = getProgressColor(spent, budget.amount);
            const percentage = Math.min((spent / budget.amount) * 100, 100);

            return (
              <li key={budget.id} className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-pink-600 mr-3" />
                  <div>
                    <p className="text-base font-medium text-gray-900">{budget.category}</p>
                    <p className="text-xs text-gray-500">{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base font-semibold text-gray-900">${budget.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">Spent: ${spent.toLocaleString()}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center ml-4 space-x-2">
                  <button onClick={() => handleEdit(budget)} className="text-indigo-600 hover:text-indigo-800"><PencilIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(budget.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-20">
        <span className="text-gray-400 text-sm">Dashboard</span>
        <span className="text-gray-400 text-sm">Recurring</span>
        <span className="text-pink-600 text-sm font-bold">Spending</span>
        <span className="text-gray-400 text-sm">Transactions</span>
        <span className="text-gray-400 text-sm">More</span>
      </div>
      {/* Demo Mode Banner */}
      <div className="fixed bottom-14 left-0 right-0 bg-gray-700 text-white text-center py-2 z-30">
        🎲 You are now in Demo Mode
      </div>
    </div>
  );
}; 