import { motion } from 'framer-motion';
import { getCategoryInfo } from '../utils/categories';

export default function CategoryBreakdown({ breakdown, totalAmount }) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="font-bold text-surface-900 dark:text-white font-display mb-4">By Category</h3>
        <div className="flex flex-col items-center py-6 text-surface-400">
          <div className="text-4xl mb-2">🏷️</div>
          <p className="text-sm">No categories yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-surface-900 dark:text-white font-display">By Category</h3>
        <span className="text-xs text-surface-500">{breakdown.length} categories</span>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, i) => {
          const catInfo = getCategoryInfo(item.category);
          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${catInfo.bg} ${catInfo.border}`}
            >
              {/* Icon */}
              <div className="text-xl w-8 flex-shrink-0 text-center">{catInfo.icon}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${catInfo.text}`}>{catInfo.label}</span>
                  <span className="text-xs font-bold text-surface-900 dark:text-white mono-num">
                    ₹{item.amount.toFixed(2)}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${catInfo.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-surface-500">{item.count} tx</span>
                  <span className={`text-[10px] font-medium ${catInfo.text}`}>{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="pt-3 border-t border-surface-100 dark:border-dark-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Tracked</span>
          <span className="text-base font-bold gradient-text mono-num">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
