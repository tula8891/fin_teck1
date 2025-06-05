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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentUser?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentUser?.email}
                  </p>
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
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Appearance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark mode
              </p>
            </div>
            <DarkModeToggle />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Security
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account security settings
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 