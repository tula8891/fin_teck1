import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { DarkModeToggle } from './DarkModeToggle';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FlagIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export const Navigation = () => {
  const navigate = useNavigate();
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Transactions', icon: CurrencyDollarIcon, path: '/transactions' },
    { name: 'Budgets', icon: ChartBarIcon, path: '/budgets' },
    { name: 'Goals', icon: FlagIcon, path: '/goals' },
    { name: 'Profile', icon: UserCircleIcon, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <item.icon className="h-6 w-6 mr-2" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 