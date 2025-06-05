import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Goals } from './pages/Goals';
import { Profile } from './pages/Profile';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <main className="pt-16 pb-20 md:pt-20">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <main className="pt-16 pb-20 md:pt-20">
                  <Transactions />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <main className="pt-16 pb-20 md:pt-20">
                  <Budgets />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <main className="pt-16 pb-20 md:pt-20">
                  <Goals />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <main className="pt-16 pb-20 md:pt-20">
                  <Profile />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; 