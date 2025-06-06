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
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-500 rounded-b-3xl px-4 pt-8 pb-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">Goals</h1>
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
        <div className="bg-white rounded-2xl shadow p-4 mb-6 mx-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
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
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600"
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
      <div className="mx-4">
        <ul role="list" className="divide-y divide-gray-100 bg-white rounded-2xl shadow">
          {goals.map((goal) => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const progressColor = getProgressColor(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);

            return (
              <li key={goal.id} className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FlagIcon className="h-6 w-6 text-pink-600 mr-3" />
                  <div>
                    <p className="text-base font-medium text-gray-900">{goal.name}</p>
                    <p className="text-xs text-gray-500">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center ml-4 space-x-2">
                  <button onClick={() => handleEdit(goal)} className="text-indigo-600 hover:text-indigo-800"><PencilIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(goal.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
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