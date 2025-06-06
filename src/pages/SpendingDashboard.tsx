import React, { useState } from 'react';
import { useStore } from '../store/store';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const periods = ['Week', 'Month', 'Quarter', 'Year'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function SpendingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [selectedMonth, setSelectedMonth] = useState('Jun');

  const transactions = useStore((state) => state.transactions);
  const currentUser = useStore((state) => state.currentUser);

  // Assume year 2024 for demo/sample data
  const selectedYear = 2024;
  const selectedMonthNum = months.indexOf(selectedMonth) + 1;
  const monthString = `${selectedYear}-${selectedMonthNum.toString().padStart(2, '0')}`;

  const monthTransactions = transactions.filter(t => t.date.startsWith(monthString));
  const income = monthTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const spend = monthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = income - spend;

  // Recent transactions (latest 5)
  const recentTransactions = monthTransactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="relative min-h-screen bg-gray-50 pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-500 rounded-b-3xl px-4 pt-8 pb-4">
        <div className="text-center text-white text-2xl font-bold mb-4">Spending</div>
        {/* Period Selector */}
        <div className="flex justify-center mb-4">
          {periods.map(period => (
            <button
              key={period}
              className={`mx-1 px-4 py-1 rounded-full text-sm font-semibold focus:outline-none transition-all ${selectedPeriod === period ? 'bg-white text-pink-600' : 'bg-white bg-opacity-20 text-white'}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
        {/* Month Bar Chart Placeholder */}
        <div className="flex justify-between items-end px-2 mb-1">
          {months.map(month => (
            <div key={month} className={`flex flex-col items-center cursor-pointer ${selectedMonth === month ? 'border-2 border-white rounded-lg' : ''}`} onClick={() => setSelectedMonth(month)}>
              {/* Bar heights are illustrative */}
              <div className="flex flex-col justify-end items-center h-12">
                <div className={`w-2 rounded bg-white ${month === 'Jun' ? 'h-8' : 'h-5'}`}></div>
                <div className={`w-2 rounded mt-1 bg-purple-300 ${month === 'Jun' ? 'h-5' : 'h-2'}`}></div>
              </div>
              <span className="text-xs text-white mt-1">{month}</span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center mt-2 pl-2">
          <span className="inline-block w-3 h-3 rounded-full bg-white mr-2"></span>
          <span className="text-xs text-white mr-4">Income</span>
          <span className="inline-block w-3 h-3 rounded-full bg-purple-300 mr-2"></span>
          <span className="text-xs text-white">Total Spend</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-4 max-w-2xl mx-auto">
        {/* Welcome */}
        {currentUser && (
          <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Welcome back, {currentUser.name}</div>
        )}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow flex items-center">
            <div className="absolute rounded-md bg-green-500 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-14">
              <div className="text-sm font-medium text-gray-500">Income</div>
              <div className="text-2xl font-semibold text-green-600">${income.toLocaleString()}</div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow flex items-center">
            <div className="absolute rounded-md bg-red-500 p-3">
              <ArrowTrendingDownIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-14">
              <div className="text-sm font-medium text-gray-500">Total Spend</div>
              <div className="text-2xl font-semibold text-red-600">${spend.toLocaleString()}</div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow flex items-center">
            <div className="absolute rounded-md bg-blue-500 p-3">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-14">
              <div className="text-sm font-medium text-gray-500">Net Income</div>
              <div className={`text-2xl font-semibold ${netIncome < 0 ? 'text-red-600' : 'text-blue-600'}`}>{netIncome < 0 ? '-' : ''}${Math.abs(netIncome).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</div>
          <a href="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View all</a>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
          <ul role="list" className="divide-y divide-gray-200">
            {recentTransactions.length === 0 && (
              <li className="px-4 py-4 text-gray-400 text-center">No transactions this month.</li>
            )}
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Budget Card */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-lg text-gray-800 mb-1">June Budget</div>
          <div className="text-gray-500 text-sm">Left For Spending</div>
          <div className="text-indigo-600 text-2xl font-bold my-1">$3,174</div>
          <div className="w-full h-2 bg-gray-200 rounded-full my-2">
            <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between mt-2">
            {/* Placeholder icons */}
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-bold text-lg text-gray-800 mb-2">Breakdown</div>
          {/* Pie/Donut Chart Placeholder */}
          <div className="flex items-center justify-center bg-gray-100 rounded-full h-32 w-32 mx-auto mb-4">
            <span className="text-gray-400">[Pie/Donut Chart]</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Include bills</span>
            <div className="w-10 h-6 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
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
} 