import { motion } from 'framer-motion';

export default function EmptyState({ hasExpenses, onAddExpense }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Illustration */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950/50 dark:to-accent-950/50 flex items-center justify-center text-4xl border-2 border-primary-200 dark:border-primary-900/50">
          {hasExpenses ? '🔍' : '💸'}
        </div>
        <div className="absolute -inset-2 bg-primary-500/5 rounded-3xl blur-xl" />
      </div>

      <h3 className="font-bold text-surface-800 dark:text-surface-200 text-base mb-1">
        {hasExpenses ? 'No matching expenses' : 'No expenses yet'}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-48 mb-5">
        {hasExpenses
          ? 'Try adjusting your filters or search term'
          : 'Start tracking your spending by adding your first expense'
        }
      </p>

      {!hasExpenses && (
        <motion.button
          id="empty-state-add-btn"
          onClick={onAddExpense}
          className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm"
          whileTap={{ scale: 0.97 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add First Expense
        </motion.button>
      )}
    </motion.div>
  );
}
