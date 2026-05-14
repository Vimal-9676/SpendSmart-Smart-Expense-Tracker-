import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const authState = localStorage.getItem('spendsmart_auth');
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        if (parsed.isLoggedIn) {
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem('spendsmart_auth');
      }
    }
    // Brief loading for smooth UX
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('spendsmart_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className={`${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-primary-950 via-dark-bg to-primary-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-lg animate-pulse-slow">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="absolute -inset-2 bg-primary-500/20 rounded-3xl blur-lg animate-pulse-slow" />
            </div>
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <Dashboard key="dashboard" onLogout={handleLogout} />
        ) : (
          <LoginPage key="login" onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
