import { motion } from 'framer-motion';
import { getCategoryInfo } from '../utils/categories';
import { formatDate } from '../utils/helpers';

export default function DeleteConfirmModal({ expense, onConfirm, onCancel }) {
  const catInfo = getCategoryInfo(expense.category);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-sm bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-surface-100 dark:border-dark-border overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Top danger stripe */}
        <div className="h-1 bg-gradient-to-r from-red-500 to-rose-600" />

        <div className="p-6">
          {/* Warning icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-center text-lg font-bold text-surface-900 dark:text-white mb-1 font-display">
            Delete Expense?
          </h2>
          <p className="text-center text-sm text-surface-500 mb-5">
            This action cannot be undone.
          </p>

          {/* Expense preview */}
          <div className={`flex items-center gap-3 p-3 rounded-2xl border mb-6 ${catInfo.bg} ${catInfo.border}`}>
            <div className="text-2xl">{catInfo.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${catInfo.text}`}>{expense.title}</p>
              <p className="text-xs text-surface-500">{formatDate(expense.date)} · {expense.category}</p>
            </div>
            <p className="font-bold text-surface-900 dark:text-white mono-num text-sm">
              ₹{expense.amount.toFixed(2)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              id="cancel-delete-btn"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-surface-200 dark:border-dark-border text-surface-600 dark:text-surface-400 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-dark-elevated transition-colors"
            >
              Cancel
            </button>
            <motion.button
              id="confirm-delete-btn"
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
