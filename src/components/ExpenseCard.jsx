import { motion } from 'framer-motion';
import { getCategoryInfo } from '../utils/categories';
import { formatDate } from '../utils/helpers';

export default function ExpenseCard({ expense, onDelete, index = 0 }) {
  const catInfo = getCategoryInfo(expense.category);

  return (
    <motion.div
      className="group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
        bg-white dark:bg-dark-card border-surface-100 dark:border-dark-border
        hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-900/60 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
    >
      {/* Category icon */}
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl ${catInfo.bg} border ${catInfo.border}`}>
        {catInfo.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-surface-900 dark:text-white text-sm truncate leading-tight">
              {expense.title}
            </h4>
            {expense.description && (
              <p className="text-xs text-surface-500 dark:text-surface-500 truncate mt-0.5 leading-tight">
                {expense.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-surface-900 dark:text-white mono-num text-sm">
              ₹{expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className={`category-badge ${catInfo.bg} ${catInfo.text} border ${catInfo.border} text-[10px] px-2 py-0.5`}>
              {catInfo.icon} {expense.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-surface-400 dark:text-surface-500">
              {formatDate(expense.date)}
            </span>
            {/* Delete button */}
            <motion.button
              id={`delete-expense-${expense.id}`}
              onClick={() => onDelete(expense)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-150"
              whileTap={{ scale: 0.9 }}
              title="Delete expense"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
