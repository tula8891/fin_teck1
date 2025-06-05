import React, { useState } from 'react';
import { useStore } from '../store/store';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

interface GoalFormData {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
}

export const Goals = () => {
  const goals = useStore((state) => state.goals);
  const addGoal = useStore((state) => state.addGoal);
  const updateGoal = useStore((state) => state.updateGoal);
  const deleteGoal = useStore((state) => state.deleteGoal);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline,
    };

    if (editingId) {
      updateGoal(editingId, goalData);
      setEditingId(null);
    } else {
      addGoal(goalData);
    }

    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
  };

  const handleEdit = (goal: any) => {
    setEditingId(goal.id);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Goals
          </h1>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Goal
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
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deadline
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
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
                {editingId ? 'Update' : 'Add'} Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {goals.map((goal) => {
          const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const progressColor = getProgressColor(goal.currentAmount, goal.targetAmount);
          const daysRemaining = getDaysRemaining(goal.deadline);

          return (
            <li key={goal.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FlagIcon className="h-6 w-6 text-gray-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : 'Deadline passed'}
                    </p>
                  </div>
                </div>
                <div className="w-32">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
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
                  onClick={() => handleEdit(goal)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
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