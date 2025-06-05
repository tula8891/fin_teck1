import React from 'react';
import { useStore } from '../store/store';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
  const currentUser = useStore((state) => state.currentUser);
  const accounts = useStore((state) => state.accounts);
  const allTransactions = useStore((state) => state.transactions);
  const transactions = React.useMemo(
    () =>
      allTransactions
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [allTransactions]
  );

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const stats = [
    {
      name: 'Total Balance',
      value: `$${totalBalance.toLocaleString()}`,
      icon: BanknotesIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Monthly Expenses',
      value: `$${monthlyExpenses.toLocaleString()}`,
      icon: ArrowTrendingDownIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.name}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <a
          href="/transactions"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          View all
        </a>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm font-medium ${
                    transaction.amount > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  ${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 