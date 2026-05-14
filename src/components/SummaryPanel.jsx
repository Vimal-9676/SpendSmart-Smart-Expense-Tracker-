import { motion } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

const StatCard = ({ label, value, icon, color, prefix = '₹', suffix = '', delay = 0 }) => {
  const animated = useAnimatedCounter(value, 900, 2);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-4 ${color.bg} border ${color.border}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium ${color.label} mb-1`}>{label}</p>
          <p className={`text-xl font-bold mono-num ${color.value}`}>
            {prefix}{animated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}
          </p>
        </div>
        <div className={`p-2 rounded-xl ${color.iconBg}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default function SummaryPanel({ stats, onAddExpense, userName }) {
  const totalAnimated = useAnimatedCounter(stats.total, 1000, 2);
  const todayAnimated = useAnimatedCounter(stats.today, 800, 2);

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-30px] right-[80px] w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-[20px] right-[120px] w-16 h-16 bg-white/10 rounded-full" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Total Expenses</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mono-num font-display">
                ₹{totalAnimated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {stats.count} {stats.count === 1 ? 'transaction' : 'transactions'} recorded
              </p>
            </div>

            <motion.button
              id="add-expense-hero-btn"
              onClick={onAddExpense}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Expense
            </motion.button>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/50 text-xs">Today</p>
              <p className="text-white font-semibold text-lg mono-num">
                ₹{todayAnimated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-white/50 text-xs">Average</p>
              <p className="text-white font-semibold text-lg mono-num">
                ₹{stats.average.toFixed(2)}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-white/50 text-xs">Highest</p>
              <p className="text-white font-semibold text-lg mono-num">
                ₹{stats.highest.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="This Month"
          value={stats.total}
          prefix="₹"
          icon={
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          }
          color={{
            bg: 'bg-primary-50 dark:bg-primary-950/40',
            border: 'border-primary-100 dark:border-primary-900',
            label: 'text-primary-600 dark:text-primary-400',
            value: 'text-primary-700 dark:text-primary-300',
            iconBg: 'bg-primary-100 dark:bg-primary-900/50',
          }}
          delay={0.1}
        />
        <StatCard
          label="Transactions"
          value={stats.count}
          prefix=""
          suffix=" total"
          icon={
            <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          }
          color={{
            bg: 'bg-accent-50 dark:bg-accent-950/40',
            border: 'border-accent-100 dark:border-accent-900',
            label: 'text-accent-600 dark:text-accent-400',
            value: 'text-accent-700 dark:text-accent-300',
            iconBg: 'bg-accent-100 dark:bg-accent-900/50',
          }}
          delay={0.15}
        />
        <StatCard
          label="Highest Spend"
          value={stats.highest}
          prefix="₹"
          icon={
            <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          }
          color={{
            bg: 'bg-rose-50 dark:bg-rose-950/40',
            border: 'border-rose-100 dark:border-rose-900',
            label: 'text-rose-600 dark:text-rose-400',
            value: 'text-rose-700 dark:text-rose-300',
            iconBg: 'bg-rose-100 dark:bg-rose-900/50',
          }}
          delay={0.2}
        />
        <StatCard
          label="Daily Average"
          value={stats.average}
          prefix="₹"
          icon={
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          }
          color={{
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-100 dark:border-emerald-900',
            label: 'text-emerald-600 dark:text-emerald-400',
            value: 'text-emerald-700 dark:text-emerald-300',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
          }}
          delay={0.25}
        />
      </div>
    </div>
  );
}
