/**
 * Format a number as currency
 */
export function formatCurrency(amount, currency = 'INR') {
  const symbols = {
    USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥',
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', SGD: 'S$',
  };
  const decimals = currency === 'JPY' ? 0 : 2;
  const symbol = symbols[currency] || currency + ' ';
  return `${symbol}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Format a number with commas
 */
export function formatNumber(num, decimals = 2) {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get the start of today's date string
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate category breakdown from expenses
 */
export function getCategoryBreakdown(expenses) {
  const breakdown = {};
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  expenses.forEach(exp => {
    if (!breakdown[exp.category]) {
      breakdown[exp.category] = { amount: 0, count: 0 };
    }
    breakdown[exp.category].amount += exp.amount;
    breakdown[exp.category].count += 1;
  });

  return Object.entries(breakdown)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get spending stats
 */
export function getSpendingStats(expenses) {
  if (expenses.length === 0) {
    return { total: 0, average: 0, highest: 0, count: 0, today: 0 };
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const today = getTodayDateString();
  const todayTotal = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
  const highest = Math.max(...expenses.map(e => e.amount));

  return {
    total,
    average: total / expenses.length,
    highest,
    count: expenses.length,
    today: todayTotal,
  };
}

/**
 * Get recent expenses (last N)
 */
export function getRecentExpenses(expenses, count = 5) {
  return [...expenses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
}

/**
 * Filter expenses by category
 */
export function filterExpenses(expenses, { category, search, sortBy = 'date_desc' }) {
  let filtered = [...expenses];

  if (category && category !== 'All') {
    filtered = filtered.filter(e => e.category === category);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }

  switch (sortBy) {
    case 'date_desc':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date_asc':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'amount_desc':
      filtered.sort((a, b) => b.amount - a.amount);
      break;
    case 'amount_asc':
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    default:
      break;
  }

  return filtered;
}
