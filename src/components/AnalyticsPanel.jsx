import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCategoryInfo } from '../utils/categories';

const BarChart = ({ data, maxAmount }) => (
  <div className="space-y-3">
    {data.map(({ category, amount, percentage }, i) => {
      const catInfo = getCategoryInfo(category);
      return (
        <div key={category}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-1.5">
              <span>{catInfo.icon}</span>
              <span>{catInfo.label}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500">{percentage.toFixed(1)}%</span>
              <span className="text-sm font-bold text-surface-900 dark:text-white mono-num">
                ₹{amount.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="progress-bar">
            <motion.div
              className={`progress-fill ${catInfo.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

const DonutSegment = ({ percentage, color, offset, total }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;
  const gap = 2;

  return (
    <circle
      r={radius}
      cx="50"
      cy="50"
      fill="none"
      stroke={color}
      strokeWidth="18"
      strokeDasharray={`${Math.max(strokeDash - gap, 0)} ${circumference}`}
      strokeDashoffset={-offset}
      strokeLinecap="round"
      style={{ transition: 'stroke-dasharray 0.8s ease, stroke-dashoffset 0.8s ease' }}
    />
  );
};

export default function AnalyticsPanel({ categoryBreakdown, stats, expenses }) {
  // Calculate donut chart offsets
  const donutData = useMemo(() => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    return categoryBreakdown.slice(0, 6).map(item => {
      const catInfo = getCategoryInfo(item.category);
      const segmentLength = (item.percentage / 100) * circumference;
      const current = { ...item, color: catInfo.hex, offset };
      offset += segmentLength;
      return current;
    });
  }, [categoryBreakdown]);

  if (expenses.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="font-bold text-surface-900 dark:text-white font-display mb-4">Spending Analytics</h3>
        <div className="flex flex-col items-center py-8 text-surface-400">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-sm">Add expenses to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-surface-900 dark:text-white font-display">Spending Analytics</h3>
        <span className="text-xs text-surface-500 bg-surface-100 dark:bg-dark-elevated px-2 py-1 rounded-lg">
          {expenses.length} transactions
        </span>
      </div>

      {/* Donut chart + legend */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
            {/* Track */}
            <circle r="36" cx="50" cy="50" fill="none" className="stroke-surface-100 dark:stroke-dark-border" strokeWidth="18" />
            {/* Segments */}
            {donutData.map((seg, i) => (
              <motion.circle
                key={seg.category}
                r="36"
                cx="50"
                cy="50"
                fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeLinecap="butt"
                strokeDasharray={`${(seg.percentage / 100) * (2 * Math.PI * 36) - 2} ${2 * Math.PI * 36}`}
                strokeDashoffset={-seg.offset}
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 36}` }}
                animate={{ strokeDasharray: `${(seg.percentage / 100) * (2 * Math.PI * 36) - 2} ${2 * Math.PI * 36}` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-surface-900 dark:text-white mono-num">₹{stats.total.toFixed(0)}</p>
            <p className="text-xs text-surface-500">Total</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {donutData.map(seg => {
            const catInfo = getCategoryInfo(seg.category);
            return (
              <div key={seg.category} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: catInfo.hex }} />
                <span className="text-xs text-surface-600 dark:text-surface-400 flex-1 truncate">{catInfo.label}</span>
                <span className="text-xs font-semibold text-surface-800 dark:text-surface-200 mono-num">
                  {seg.percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
          {categoryBreakdown.length > 6 && (
            <p className="text-xs text-surface-400">+{categoryBreakdown.length - 6} more categories</p>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-surface-100 dark:bg-dark-border" />

      {/* Bar chart */}
      <div>
        <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">Category Breakdown</h4>
        <BarChart data={categoryBreakdown} maxAmount={stats.total} />
      </div>
    </div>
  );
}
