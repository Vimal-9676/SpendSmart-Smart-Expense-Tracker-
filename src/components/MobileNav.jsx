import { motion } from 'framer-motion';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/>
      </svg>
    ),
  },
  {
    id: 'add',
    label: 'Add',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
    isAction: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'AI Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

export default function MobileNav({ activeTab, onTabChange, onAddExpense }) {
  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-surface-200 dark:border-dark-border bg-white/90 dark:bg-dark-bg/90 safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV_ITEMS.map(item => {
          if (item.isAction) {
            return (
              <motion.button
                key={item.id}
                id={`mobile-nav-add`}
                onClick={onAddExpense}
                className="relative flex flex-col items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-glow -mt-5">
                  {item.icon}
                </div>
                <span className="text-[10px] text-surface-500 mt-1 font-medium">{item.label}</span>
              </motion.button>
            );
          }

          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <div className={`transition-colors duration-200 ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
