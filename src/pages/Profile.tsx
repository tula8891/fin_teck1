import React, { useState } from 'react';
import { useStore } from '../store/store';
import { DarkModeToggle } from '../components/DarkModeToggle';

interface ProfileFormData {
  name: string;
  email: string;
  avatar: string;
}

export const Profile = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-500 rounded-b-3xl px-4 pt-8 pb-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <DarkModeToggle />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mx-4">
        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-900">{currentUser?.name}</h2>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        )}
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