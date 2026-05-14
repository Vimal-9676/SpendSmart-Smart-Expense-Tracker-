import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Fake user credentials
const DEMO_USERS = [
  { email: 'demo@spendsmart.app', password: 'demo123', name: 'Alex Morgan' },
  { email: 'admin@spendsmart.app', password: 'admin123', name: 'Admin User' },
];

const FloatingOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-float ${className}`} />
);

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Load saved email if remember me was checked
  useEffect(() => {
    const saved = localStorage.getItem('spendsmart_remember');
    if (saved && !isSignup) {
      try {
        const { email } = JSON.parse(saved);
        setForm(prev => ({ ...prev, email }));
        setRememberMe(true);
      } catch {}
    }
  }, [isSignup]);

  const validate = () => {
    const errs = {};
    if (isSignup && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    if (isSignup) {
      if (!form.confirmPassword) errs.confirmPassword = 'Confirm password is required';
      else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));

    // Get all registered users from local storage
    let storedUsers = [];
    try {
      const savedUsers = localStorage.getItem('spendsmart_users');
      if (savedUsers) storedUsers = JSON.parse(savedUsers);
    } catch {}

    const allUsers = [...DEMO_USERS, ...storedUsers];

    if (isSignup) {
      const userExists = allUsers.some(u => u.email.toLowerCase() === form.email.toLowerCase());
      if (userExists) {
        setLoading(false);
        toast.error('Email already exists');
        setErrors({ email: 'Account with this email already exists' });
        return;
      }

      // Add new user
      const newUser = { email: form.email, password: form.password, name: form.name };
      storedUsers.push(newUser);
      localStorage.setItem('spendsmart_users', JSON.stringify(storedUsers));
      
      setLoading(false);
      toast.success('Account created successfully! Please sign in.');
      setIsSignup(false); // Redirect back to login
      setForm({ ...form, password: '', confirmPassword: '' });
      return;
    }

    // Login flow
    const user = allUsers.find(
      u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    );

    if (user) {
      // Save auth state
      localStorage.setItem('spendsmart_auth', JSON.stringify({
        isLoggedIn: true,
        user: { email: user.email, name: user.name },
        loginAt: new Date().toISOString(),
      }));

      if (rememberMe) {
        localStorage.setItem('spendsmart_remember', JSON.stringify({ email: form.email }));
      } else {
        localStorage.removeItem('spendsmart_remember');
      }

      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🎉`);
      setTimeout(onLogin, 400);
    } else {
      setLoading(false);
      toast.error('Invalid email or password');
      setErrors({ password: 'Invalid credentials. Try demo@spendsmart.app / demo123' });
    }
  };

  const fillDemo = () => {
    setIsSignup(false);
    setForm({ ...form, email: 'demo@spendsmart.app', password: 'demo123' });
    setErrors({});
  };

  return (
    <motion.div
      className="login-bg min-h-screen w-full flex items-center justify-center p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background orbs */}
      <FloatingOrb className="w-96 h-96 bg-primary-500 top-[-10%] left-[-10%]" />
      <FloatingOrb className="w-80 h-80 bg-accent-500 bottom-[-5%] right-[-5%]" style={{ animationDelay: '2s' }} />
      <FloatingOrb className="w-64 h-64 bg-blue-500 top-[40%] right-[10%]" style={{ animationDelay: '4s' }} />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative w-full max-w-md z-10 my-8">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-glow-lg mb-4 relative">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-2xl blur" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">SpendSmart</h1>
          <p className="text-surface-400 mt-1 text-sm">Your intelligent expense companion</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        >
          {/* Card glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-3xl blur-lg" />

          <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white font-display">
                {isSignup ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className="text-surface-400 text-sm mt-1">
                {isSignup ? 'Sign up to start tracking expenses' : 'Sign in to your account to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name field (Signup only) */}
              <AnimatePresence>
                {isSignup && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-surface-300 mb-2 mt-1">
                      Full Name
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'name' ? 'transform scale-[1.01]' : ''}`}>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name-input"
                        type="text"
                        value={form.name}
                        onChange={e => { setForm(p => ({...p, name: e.target.value})); setErrors(p => ({...p, name: ''})); }}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-surface-500
                          text-sm transition-all duration-200 outline-none
                          ${errors.name
                            ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20'
                          }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        {errors.name}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2 mt-1">
                  Email address
                </label>
                <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                    <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email: ''})); }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-surface-500
                      text-sm transition-all duration-200 outline-none
                      ${errors.email
                        ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2 mt-1">
                  Password
                </label>
                <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.01]' : ''}`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password: ''})); }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border text-white placeholder-surface-500
                      text-sm transition-all duration-200 outline-none
                      ${errors.password
                        ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field (Signup only) */}
              <AnimatePresence>
                {isSignup && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-surface-300 mb-2 mt-1">
                      Confirm Password
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'confirmPassword' ? 'transform scale-[1.01]' : ''}`}>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </div>
                      <input
                        id="confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={e => { setForm(p => ({...p, confirmPassword: e.target.value})); setErrors(p => ({...p, confirmPassword: ''})); }}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-surface-500
                          text-sm transition-all duration-200 outline-none
                          ${errors.confirmPassword
                            ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-white/10 focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20'
                          }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me (Login only) */}
              {!isSignup && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setRememberMe(p => !p)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200
                          ${rememberMe
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-white/20 bg-white/5 hover:border-primary-500/50'
                          }`}
                      >
                        {rememberMe && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-surface-400 group-hover:text-surface-300 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                id={isSignup ? "signup-submit-btn" : "login-submit-btn"}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base mt-2"
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {isSignup ? 'Creating account...' : 'Signing in...'}
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      {isSignup ? 'Sign up →' : 'Sign in →'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
            
            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center text-sm text-surface-400">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                }} 
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-surface-500">or try demo</span>
              </div>
            </div>

            {/* Demo credentials */}
            <motion.button
              id="use-demo-btn"
              onClick={fillDemo}
              className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-surface-300 hover:text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <span>⚡</span>
              <span>Use Demo Account</span>
            </motion.button>
            
            {!isSignup && (
              <p className="text-center text-surface-600 text-xs mt-4">
                demo@spendsmart.app · demo123
              </p>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-surface-600 text-xs mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          © 2026 SpendSmart. Built with ❤️ for smart finance management.
        </motion.p>
      </div>
    </motion.div>
  );
}
