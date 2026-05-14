import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ user, theme, onToggleTheme, onLogout, onAddExpense, searchQuery, onSearchChange }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.nav
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-dark-bg/80 backdrop-blur-xl border-dark-border'
          : 'bg-white/80 backdrop-blur-xl border-surface-200'
      }`}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold font-display gradient-text">SpendSmart</span>
              <p className="text-xs text-surface-500 dark:text-surface-500 leading-none">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
              </p>
            </div>
          </div>

          {/* Center - Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm transition-all duration-200 outline-none
                  ${theme === 'dark'
                    ? 'bg-dark-elevated border border-dark-border text-white placeholder-surface-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30'
                    : 'bg-surface-100 border border-surface-200 text-surface-900 placeholder-surface-400 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 focus:bg-white'
                  }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              id="mobile-search-btn"
              onClick={() => setShowSearch(p => !p)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-elevated text-surface-500 dark:text-surface-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Theme toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Add expense button */}
            <motion.button
              id="add-expense-navbar-btn"
              onClick={onAddExpense}
              className="btn-primary hidden sm:flex items-center gap-2 py-2 px-4 text-sm"
              whileTap={{ scale: 0.96 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Expense</span>
            </motion.button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu(p => !p)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {getInitials(user?.name)}
                </div>
                <svg className={`w-4 h-4 text-surface-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden z-50 ${
                      theme === 'dark'
                        ? 'bg-dark-elevated border-dark-border'
                        : 'bg-white border-surface-200'
                    }`}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* User info */}
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-dark-border' : 'border-surface-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(user?.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-border transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Profile Settings
                      </button>
                      <button
                        id="logout-btn"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="pb-3 md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none
                    ${theme === 'dark'
                      ? 'bg-dark-elevated border border-dark-border text-white placeholder-surface-500'
                      : 'bg-surface-100 border border-surface-200 text-surface-900 placeholder-surface-400'
                    }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
