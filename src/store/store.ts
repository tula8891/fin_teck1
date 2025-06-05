import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleUsers } from '../data/sampleUsers';
import { sampleAccounts } from '../data/sampleAccounts';
import { sampleTransactions } from '../data/sampleTransactions';
import { sampleBudgets } from '../data/sampleBudgets';
import { sampleGoals } from '../data/sampleGoals';

// Types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface Store {
  // Auth state
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const useStore = create(
  persist<Store>(
    (set) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      users: sampleUsers,
      accounts: sampleAccounts,
      transactions: sampleTransactions,
      budgets: sampleBudgets,
      goals: sampleGoals,

      // Auth actions
      login: (email: string, password: string) => {
        const user = sampleUsers.find(
          u => u.email === email && u.password === password
        );
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // Data actions
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: generateId() },
          ],
        })),

      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, { ...budget, id: generateId() }],
        })),

      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: generateId() }],
        })),

      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    {
      name: 'finteck-auth',
      partialize: (state) =>
        ({
          isAuthenticated: state.isAuthenticated,
          currentUser: state.currentUser,
        } as unknown as Store),
    }
  )
); 