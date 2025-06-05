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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Budgets
          </h1>
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
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Period
                </label>
                <select
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {budgets.map((budget) => {
          const spent = calculateSpent(budget.category);
          const progressColor = getProgressColor(spent, budget.amount);
          const percentage = Math.min((spent / budget.amount) * 100, 100);

          return (
            <li key={budget.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {budget.category}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                    </p>
                  </div>
                </div>
                <div className="w-32">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                          ${spent.toLocaleString()} / ${budget.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor}`}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(budget)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}; 