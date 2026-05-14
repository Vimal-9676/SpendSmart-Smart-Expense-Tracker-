import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '../hooks/useExpenses';
import { useTheme } from '../hooks/useTheme';
import { getCategoryBreakdown, getSpendingStats, filterExpenses } from '../utils/helpers';
import Navbar from '../components/Navbar';
import SummaryPanel from '../components/SummaryPanel';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import AnalyticsPanel from '../components/AnalyticsPanel';
import GeminiAssistant from '../components/GeminiAssistant';
import CategoryBreakdown from '../components/CategoryBreakdown';
import MobileNav from '../components/MobileNav';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Dashboard({ onLogout }) {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const { theme, toggleTheme } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('dashboard');

  // Computed data
  const stats = useMemo(() => getSpendingStats(expenses), [expenses]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(expenses), [expenses]);
  const filteredExpenses = useMemo(() =>
    filterExpenses(expenses, { category: filterCategory, search: searchQuery, sortBy }),
    [expenses, filterCategory, searchQuery, sortBy]
  );

  // Handle delete confirmation
  const handleDeleteRequest = (expense) => {
    setDeleteTarget(expense);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteExpense(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleAddExpense = (data) => {
    addExpense(data);
    setShowForm(false);
  };

  // Get user info
  const userInfo = useMemo(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('spendsmart_auth') || '{}');
      return auth.user || { name: 'User', email: 'user@example.com' };
    } catch {
      return { name: 'User', email: 'user@example.com' };
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-mesh-dark text-white'
        : 'bg-mesh-light text-surface-900'
    }`}>
      {/* Navbar */}
      <Navbar
        user={userInfo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={onLogout}
        onAddExpense={() => setShowForm(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column - main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome & Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={activeMobileTab !== 'dashboard' ? 'hidden lg:block' : 'block'}
            >
              <SummaryPanel
                stats={stats}
                onAddExpense={() => setShowForm(true)}
                userName={userInfo.name}
              />
            </motion.div>

            {/* Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={activeMobileTab !== 'analytics' && activeMobileTab !== 'dashboard' ? 'hidden lg:block' : 'block'}
            >
              <AnalyticsPanel
                categoryBreakdown={categoryBreakdown}
                stats={stats}
                expenses={expenses}
              />
            </motion.div>

            {/* Expense list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={activeMobileTab !== 'expenses' && activeMobileTab !== 'dashboard' ? 'hidden lg:block' : 'block'}
            >
              <ExpenseList
                expenses={filteredExpenses}
                allExpenses={expenses}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onDelete={handleDeleteRequest}
                onAddExpense={() => setShowForm(true)}
              />
            </motion.div>
          </div>

          {/* Right column - sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={activeMobileTab !== 'ai' && activeMobileTab !== 'dashboard' ? 'hidden lg:block' : 'block'}
            >
              <GeminiAssistant
                stats={stats}
                categoryBreakdown={categoryBreakdown}
                expenses={expenses}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={activeMobileTab !== 'analytics' && activeMobileTab !== 'dashboard' ? 'hidden lg:block' : 'block'}
            >
              <CategoryBreakdown breakdown={categoryBreakdown} totalAmount={stats.total} />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
        onAddExpense={() => setShowForm(true)}
      />

      {/* Add expense modal */}
      <AnimatePresence>
        {showForm && (
          <ExpenseForm
            onSubmit={handleAddExpense}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            expense={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
