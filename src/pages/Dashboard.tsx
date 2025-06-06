import React from 'react';
import { useStore } from '../store/store';
import {
  Cog6ToothIcon,
  BellIcon,
  InformationCircleIcon,
  BanknotesIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const accountIcons = {
  Checking: BanknotesIcon,
  'Card Balance': CreditCardIcon,
  'Net Cash': CurrencyDollarIcon,
  Savings: BanknotesIcon,
  Investments: ChartBarIcon,
};

export const Dashboard = () => {
  const currentUser = useStore((state) => state.currentUser);
  const accounts = useStore((state) => state.accounts);

  // Date for header
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  // Example credit score data (static for now)
  const creditScore = 678;
  const creditScoreChange = 38;
  const creditScoreData = [650, 640, 635, 640, 660, 678];
  const creditScoreMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-500 rounded-b-3xl px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-2">
          <Cog6ToothIcon className="h-6 w-6 text-white" />
          <div className="text-white text-sm font-medium">{dateString}</div>
          <div className="relative">
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1">1</span>
          </div>
        </div>
        {/* Alert Banner */}
        <div className="bg-pink-800 bg-opacity-80 rounded-xl flex items-center px-4 py-2 mb-4">
          <InformationCircleIcon className="h-5 w-5 text-white mr-2" />
          <span className="text-white text-sm flex-1">An account requires attention</span>
          <span className="text-white text-lg">&gt;</span>
        </div>
      </div>

      {/* Credit Score Card */}
      <div className="mx-4 -mt-12 mb-4 bg-white rounded-2xl shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-500">Credit Score</div>
          <div className="flex items-center text-green-600 text-xs font-medium">
            <span className="mr-1">▲</span>{creditScoreChange} points this month
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{creditScore}</div>
        {/* Line chart placeholder */}
        <div className="w-full h-20 flex items-end">
          {/* Simple SVG line chart placeholder */}
          <svg width="100%" height="60" viewBox="0 0 200 60">
            <polyline
              fill="rgba(139,92,246,0.1)"
              stroke="none"
              points="0,40 40,45 80,50 120,48 160,30 200,20 200,60 0,60"
            />
            <polyline
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              points="0,40 40,45 80,50 120,48 160,30 200,20"
            />
            {creditScoreData.map((score, i) => (
              <circle
                key={i}
                cx={i * 40}
                cy={60 - (score - 630) * 0.8}
                r="3"
                fill="#fff"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {creditScoreMonths.map((m) => <span key={m}>{m}</span>)}
        </div>
        <button className="mt-2 w-full flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
          <span className="flex items-center"><InformationCircleIcon className="h-5 w-5 mr-2" />View Credit Score</span>
          <span>&gt;</span>
        </button>
      </div>

      {/* Accounts List */}
      <div className="mx-4 mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">ACCOUNTS</div>
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span></span>
          <span>2 days ago | <a href="#" className="underline">Sync now</a></span>
        </div>
        <div className="bg-white rounded-2xl shadow divide-y divide-gray-100">
          {accounts.map((account) => {
            const Icon = accountIcons[account.name as keyof typeof accountIcons] || BanknotesIcon;
            return (
              <div key={account.id} className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  <Icon className="h-7 w-7 text-gray-700 mr-3" />
                  <span className="text-base text-gray-900 font-medium">{account.name}</span>
                </div>
                <span className={`text-base font-semibold ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>{account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-20">
        <div className="flex flex-col items-center">
          <span className="text-pink-600"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg></span>
          <span className="text-xs text-pink-600 font-bold">Dashboard</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></span>
          <span className="text-xs text-gray-400">Recurring</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></span>
          <span className="text-xs text-gray-400">Spending</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></span>
          <span className="text-xs text-gray-400">Transactions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></span>
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
      {/* Demo Mode Banner */}
      <div className="fixed bottom-14 left-0 right-0 bg-gray-700 text-white text-center py-2 z-30">
        🎲 You are now in Demo Mode
      </div>
    </div>
  );
}; 