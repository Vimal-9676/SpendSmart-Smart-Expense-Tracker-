import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CATEGORY_KEYS } from '../utils/categories';
import { detectCategoryWithConfidence } from '../utils/categoryDetection';
import { getTodayDateString } from '../utils/helpers';

const initialForm = {
  title: '',
  amount: '',
  description: '',
  date: getTodayDateString(),
  category: '',
};

export default function ExpenseForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto detect category as user types
  useEffect(() => {
    if (form.title.length > 2 || form.description.length > 2) {
      const result = detectCategoryWithConfidence(form.title, form.description);
      if (result.category !== 'Other' || result.confidence === 'high') {
        setDetectedCategory(result);
        if (!form.category) {
          setForm(p => ({ ...p, category: result.category }));
        }
      }
    }
  }, [form.title, form.description]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount) errs.amount = 'Amount is required';
    else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    onSubmit({
      ...form,
      category: form.category || detectedCategory?.category || 'Other',
    });
    toast.success('Expense added successfully! 🎉');
    setIsSubmitting(false);
  };

  const updateField = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full sm:max-w-lg bg-white dark:bg-dark-card rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-100 dark:border-dark-border overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header gradient */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600" />

        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-surface-300 dark:bg-dark-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white font-display">Add New Expense</h2>
            <p className="text-xs text-surface-500 mt-0.5">Track your spending intelligently</p>
          </div>
          <button
            id="close-expense-form"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-elevated text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Expense Title <span className="text-red-500">*</span>
            </label>
            <input
              id="expense-title-input"
              type="text"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. Netflix, Uber ride, Groceries..."
              className={`input-field ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}

            {/* Auto-detected category badge */}
            <AnimatePresence>
              {detectedCategory && detectedCategory.category !== 'Other' && (
                <motion.div
                  className="flex items-center gap-2 mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <span className="text-xs text-surface-500">🤖 Auto-detected:</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900 font-medium">
                    {detectedCategory.category}
                  </span>
                  <span className={`text-xs ${
                    detectedCategory.confidence === 'high' ? 'text-green-500' :
                    detectedCategory.confidence === 'medium' ? 'text-yellow-500' : 'text-surface-400'
                  }`}>
                    {detectedCategory.confidence}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amount & Date in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Amount (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">₹</span>
                <input
                  id="expense-amount-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => updateField('amount', e.target.value)}
                  placeholder="0.00"
                  className={`input-field pl-7 ${errors.amount ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="expense-date-input"
                type="date"
                value={form.date}
                max={getTodayDateString()}
                onChange={e => updateField('date', e.target.value)}
                className={`input-field ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Category
              <span className="ml-2 text-xs text-surface-400 font-normal">(auto-detected from title)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_KEYS.map(cat => (
                <button
                  key={cat}
                  type="button"
                  id={`category-${cat.toLowerCase()}`}
                  onClick={() => updateField('category', cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                    form.category === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-glow'
                      : 'bg-surface-50 dark:bg-dark-elevated border-surface-200 dark:border-dark-border text-surface-600 dark:text-surface-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Description <span className="text-surface-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              id="expense-description-input"
              rows={2}
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Add any notes or details..."
              className="input-field resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-surface-200 dark:border-dark-border text-surface-600 dark:text-surface-400 font-medium text-sm hover:bg-surface-50 dark:hover:bg-dark-elevated transition-colors"
            >
              Cancel
            </button>
            <motion.button
              id="submit-expense-btn"
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add Expense
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
