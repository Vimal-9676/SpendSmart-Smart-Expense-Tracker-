import { useState, useEffect, useCallback } from 'react';
import { detectCategory } from '../utils/categoryDetection';

const STORAGE_KEY = 'spendsmart_expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = useCallback((expenseData) => {
    const autoCategory = detectCategory(expenseData.title, expenseData.description);
    const newExpense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: expenseData.title.trim(),
      amount: parseFloat(expenseData.amount),
      description: expenseData.description?.trim() || '',
      date: expenseData.date || new Date().toISOString().split('T')[0],
      category: expenseData.category || autoCategory,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setExpenses(prev => prev.map(exp =>
      exp.id === id ? { ...exp, ...updates, updatedAt: new Date().toISOString() } : exp
    ));
  }, []);

  const clearAllExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  return {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    clearAllExpenses,
  };
}
