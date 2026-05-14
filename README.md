# SpendSmart — Premium Expense Tracker 💸

A **production-ready, fintech-style expense tracking dashboard** built with React + Vite + Tailwind CSS + Framer Motion.

![SpendSmart Dashboard](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Login with LocalStorage persistence, remember me, show/hide password |
| 📊 **Dashboard** | Hero summary card, stat cards, animated counters |
| ➕ **Add Expenses** | Title, amount, date, category, description with live validation |
| 🤖 **Auto Category** | Smart keyword-based detection (Uber → Travel, Netflix → Entertainment, etc.) |
| 📈 **Analytics** | Animated SVG donut chart + category progress bars |

| 🌙 **Dark / Light Mode** | Smooth transitions, persisted in LocalStorage |
| 🔍 **Search & Filter** | Real-time search, filter by category, sort options |
| 🗑️ **Delete with Confirm** | Spring-animated delete confirmation modal |
| 📱 **Mobile-first** | Responsive bottom nav, glassmorphism, works on all screen sizes |
| 🎞️ **Animations** | Framer Motion throughout — page transitions, card entry, counters |
| 💾 **LocalStorage** | Expenses, auth state, theme, currency rates all persisted |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Demo Credentials

| Email | Password |
|---|---|
| `demo@spendsmart.app` | `demo123` |
| `admin@spendsmart.app` | `admin123` |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AnalyticsPanel.jsx     # Donut chart + bar chart
│   ├── CategoryBreakdown.jsx  # Sidebar category breakdown

│   ├── DeleteConfirmModal.jsx # Delete confirmation
│   ├── EmptyState.jsx         # Empty/no-results state
│   ├── ExpenseCard.jsx        # Individual expense row
│   ├── ExpenseForm.jsx        # Add expense modal
│   ├── ExpenseList.jsx        # Filterable expense list
│   ├── MobileNav.jsx          # Bottom navigation (mobile)
│   ├── Navbar.jsx             # Top navigation bar
│   ├── SummaryPanel.jsx       # Hero + stat cards
│   └── ThemeToggle.jsx        # Dark/light toggle
├── hooks/
│   ├── useAnimatedCounter.js  # Animated number counter
│   ├── useExpenses.js         # CRUD + LocalStorage
│   └── useTheme.js            # Theme management
├── pages/
│   ├── Dashboard.jsx          # Main dashboard page
│   └── LoginPage.jsx          # Auth page
├── utils/
│   ├── categories.js          # Category metadata & colors
│   ├── categoryDetection.js   # Smart auto-detection
│   └── helpers.js             # Formatters, filters, stats

├── styles/
│   └── index.css              # Global styles + Tailwind
├── App.jsx                    # Root with routing
└── main.jsx                   # Entry point
```

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** — Fast dev builds
- **Tailwind CSS 3** — Utility-first styling with custom design tokens
- **Framer Motion 11** — Smooth animations everywhere
- **react-hot-toast** — Beautiful toast notifications

- **LocalStorage** — Zero-backend persistence

---

## 📦 Deploy

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag dist/ folder to netlify.com/drop
```

### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 🎨 Design Highlights

- **Glassmorphism** login page with animated orbs
- **Fintech-style** gradient hero card
- **SVG donut chart** (no chart library — pure SVG + Framer Motion)
- **Mesh gradient** backgrounds (light + dark)
- **Micro-animations** on every interactive element
- **Google Fonts** — Inter + Plus Jakarta Sans
- Custom **Tailwind tokens** for primary/accent/surface/dark palettes

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| `< 640px` (Mobile) | Single column, bottom nav, stacked cards |
| `640–1024px` (Tablet) | Single column, no bottom nav |
| `> 1024px` (Desktop) | 2/3 + 1/3 sidebar layout |

---

## 🧠 Smart Category Detection Examples

| Input | Detected Category |
|---|---|
| "Uber ride to airport" | Travel ✈️ |
| "Netflix monthly" | Entertainment 🎬 |
| "Pizza Hut dinner" | Food 🍔 |
| "Electricity bill" | Utilities ⚡ |
| "Rent payment March" | Rent 🏠 |
| "Amazon shopping" | Shopping 🛍️ |
| "Gym membership" | Health 🏥 |
| "Udemy course" | Education 📚 |

---

## 📄 License

MIT — Free to use, modify, and deploy.

---

Made with ❤️ and ☕ — **SpendSmart v1.0.0**
