import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askGemini, hasApiKey, saveApiKey } from '../services/geminiService';

export default function GeminiAssistant({ stats, categoryBreakdown, expenses }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your SpendSmart AI Assistant. How can I help you manage your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(!hasApiKey());
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (apiKeyInput.trim().length > 10) {
      saveApiKey(apiKeyInput.trim());
      setNeedsKey(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      
      const responseText = await askGemini(userText, messages, {
        stats,
        categoryBreakdown,
        recentExpenses
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      if (error.message.includes('API key')) {
        setNeedsKey(true);
      }
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${error.message}`, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsKey) {
    return (
      <div className="card p-5 h-[400px] flex flex-col justify-center">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3 text-primary-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="font-bold text-surface-900 dark:text-white font-display">Connect Gemini AI</h3>
          <p className="text-xs text-surface-500 mt-1">Please provide your Gemini API key to enable the AI assistant. It will be stored securely in your browser.</p>
        </div>
        <form onSubmit={handleSaveKey} className="space-y-3">
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter Gemini API Key"
            className="w-full px-4 py-2 text-sm rounded-xl border border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-dark-bg text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            required
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Save API Key
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b border-surface-100 dark:border-dark-border bg-gradient-to-r from-primary-500/10 to-accent-500/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white shadow-glow">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-surface-900 dark:text-white text-sm font-display leading-tight">SpendSmart AI Assistant</h3>
          <span className="text-[10px] text-primary-600 dark:text-primary-400 font-medium tracking-wide uppercase">AI Financial Advisor</span>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-surface-200 dark:scrollbar-thumb-dark-border scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : msg.isError
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-bl-sm'
                      : 'bg-surface-100 dark:bg-dark-elevated text-surface-800 dark:text-surface-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-surface-100 dark:bg-dark-elevated rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-surface-50 dark:bg-dark-card border-t border-surface-100 dark:border-dark-border">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your expenses..."
            className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-dark-bg border border-surface-200 dark:border-dark-border rounded-xl text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-200 dark:disabled:bg-surface-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
