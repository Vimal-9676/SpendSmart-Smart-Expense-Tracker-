import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExpenseCard from './ExpenseCard';
import EmptyState from './EmptyState';
import { CATEGORY_KEYS } from '../utils/categories';

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Highest amount' },
  { value: 'amount_asc', label: 'Lowest amount' },
];

export default function ExpenseList({
  expenses,
  allExpenses,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  onDelete,
  onAddExpense,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categories = ['All', ...CATEGORY_KEYS];
  const displayCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-surface-900 dark:text-white font-display">Expense History</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {expenses.length} of {allExpenses.length} transactions
          </p>
        </div>

        {/* Sort */}
        <select
          id="sort-expenses-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-sm rounded-xl border border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-dark-elevated text-surface-700 dark:text-surface-300 px-3 py-2 outline-none focus:border-primary-500 transition-colors"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {displayCategories.map(cat => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              filterCategory === cat
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface-100 dark:bg-dark-elevated text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-dark-border'
            }`}
          >
            {cat}
          </button>
        ))}
        {categories.length > 6 && (
          <button
            onClick={() => setShowAllCategories(p => !p)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
          >
            {showAllCategories ? 'Show less' : `+${categories.length - 6} more`}
          </button>
        )}
      </div>

      {/* Expense list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
        <AnimatePresence mode="popLayout">
          {expenses.length === 0 ? (
            <EmptyState
              key="empty"
              hasExpenses={allExpenses.length > 0}
              onAddExpense={onAddExpense}
            />
          ) : (
            expenses.map((expense, i) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={onDelete}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
