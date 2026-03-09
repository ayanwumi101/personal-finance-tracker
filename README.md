# Finance Snapshot - Personal Finance Tracker

A modern, responsive personal finance tracker built with React and Next.js that helps users visualize their monthly income and expenses, manage budgets, and track spending habits.

## Project Overview

Finance Snapshot is a client-side personal finance application that provides users with a comprehensive dashboard to manage their financial data. The application features transaction management, budget tracking with visual indicators, and interactive charts for spending analysis.

### Key Features

- **Dashboard Overview**: Displays total balance, income, expenses, and savings rate with clear visual indicators
- **Transaction Management**: Add income/expense transactions with category, description, and date; delete transactions as needed
- **Budget Management**: Set and edit budget limits per expense category with progress bars showing over/under status
- **Spending Visualization**: Interactive pie chart showing expense breakdown by category
- **Monthly Trends**: Bar chart comparing income vs expenses over the last 6 months
- **Data Persistence**: All data persists to localStorage for seamless user experience across sessions
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens

## Technical Choices & Rationale

### Framework & Libraries

| Technology | Reason |
|------------|--------|
| **Next.js 16 (App Router)** | Provides excellent developer experience, built-in optimizations, and modern React patterns with server components |
| **TypeScript** | Ensures type safety, better IDE support, and catches errors at compile time |
| **Tailwind CSS v4** | Utility-first CSS framework enabling rapid UI development with consistent design tokens |
| **shadcn/ui** | High-quality, accessible, and customizable component library that integrates seamlessly with Tailwind |
| **Recharts** | Lightweight, composable charting library built specifically for React with excellent customization options |
| **localStorage** | Simple client-side persistence suitable for a personal finance tracker without backend requirements |

### Architecture Decisions

1. **Custom Hook Pattern (`useFinance`)**: Centralized all finance-related state and logic in a single custom hook, promoting separation of concerns and reusability. This hook manages transactions, budgets, and computed values like category totals and budget status.

2. **Component Composition**: Split the UI into focused, single-responsibility components:
   - `OverviewCards` - Summary statistics
   - `TransactionsList` - Transaction display and deletion
   - `AddTransactionDialog` - Transaction creation form
   - `BudgetCard` - Budget management and visualization
   - `SpendingChart` - Pie chart for category breakdown
   - `MonthlyTrendChart` - Bar chart for historical trends

3. **Design Token System**: Implemented a comprehensive color system using CSS custom properties with OKLCH color space for perceptually uniform colors. This enables easy theming and maintains consistency across the application.

4. **Mobile-First Responsive Design**: Built all components with mobile breakpoints first, then enhanced for larger screens. This ensures a great experience on all devices.

### Design Choices

- **Color Palette**: Warm neutral tones (cream/beige background with dark text) for a professional, trustworthy feel. Green accents for income/success states, red for expenses/warnings.
- **Typography**: Clean, readable fonts with appropriate sizing hierarchy across breakpoints
- **Layout**: Centered content container with max-width constraint for optimal readability on large screens
- **Visual Feedback**: Progress bars for budget status, color-coded indicators for over/under budget, and clear income/expense differentiation

## What I Would Improve With More Time

### Features
- **Data Export/Import**: Allow users to export transactions as CSV/JSON and import from bank statements
- **Recurring Transactions**: Support for scheduled recurring income/expenses (rent, subscriptions, salary)
- **Multiple Accounts**: Track separate accounts (checking, savings, credit cards) with transfers between them
- **Goals & Savings Targets**: Set financial goals with progress tracking and milestone notifications
- **Search & Filtering**: Advanced filtering by date range, category, amount range, and full-text search
- **Transaction Categories**: Allow users to create custom categories beyond the preset options

### Technical Improvements
- **Backend Integration**: Migrate from localStorage to a proper database (Supabase/Neon) for data security and multi-device sync
- **Authentication**: Add user accounts for secure, personalized data storage
- **Data Validation**: Implement Zod schemas for robust form validation and data integrity
- **Optimistic Updates**: Improve perceived performance with optimistic UI updates
- **Undo/Redo**: Transaction history with ability to undo recent deletions
- **PWA Support**: Enable offline functionality and installable app experience
- **Accessibility Audit**: Comprehensive a11y testing and improvements for screen readers

### UI/UX Enhancements
- **Dark Mode Toggle**: User-controlled theme switching (currently only responds to system preference)
- **Animations**: Smooth transitions for chart updates, list changes, and modal interactions using Framer Motion
- **Onboarding Flow**: Guided setup for first-time users to configure categories and initial budgets
- **Dashboard Customization**: Allow users to rearrange and show/hide dashboard widgets

## Challenges Faced

### 1. Mobile Responsiveness
The initial implementation worked well on desktop but required significant refinement for mobile screens. Challenges included:
- Fitting 4 overview cards into a 2-column mobile grid while maintaining readability
- Making charts legible on small screens without losing important data
- Ensuring touch targets were appropriately sized for mobile interaction
- Managing the transaction list item layout with truncation for long descriptions

**Solution**: Implemented comprehensive responsive breakpoints using Tailwind's `sm:` prefix, adjusted font sizes, padding, and component heights specifically for mobile, and made delete buttons always visible on touch devices.

### 2. Color System Consistency
Initially, the accent and ring colors were set to green, which created visual confusion with the success/income color. Hover states and focus rings appeared as income indicators rather than neutral interaction states.

**Solution**: Separated the semantic colors (success for income, destructive for expenses) from interaction colors (accent, ring) by changing accent/ring to neutral gray tones while preserving the green for explicit income/success indicators.

### 3. Chart Sizing and Labels
Recharts required careful configuration to work well across screen sizes. Pie chart labels overlapped on mobile, and bar chart axis labels were too large for small screens.

**Solution**: Removed inline labels from the pie chart in favor of a separate legend grid, reduced axis font sizes, and adjusted chart heights based on screen size.

### 4. Budget Status Calculation
Computing real-time budget status across multiple categories while maintaining performance required careful state management. Each transaction addition/deletion needed to trigger recalculation of spent amounts, remaining budgets, and percentage values.

**Solution**: Leveraged `useMemo` hooks to compute derived state only when dependencies change, and structured the data flow to minimize unnecessary re-renders.

## Time Spent

| Phase | Time |
|-------|------|
| Initial setup & design inspiration | ~15 minutes |
| Core architecture (types, hooks, data structure) | ~25 minutes |
| Dashboard components (cards, charts, lists) | ~35 minutes |
| Budget feature implementation | ~20 minutes |
| Mobile responsiveness improvements | ~25 minutes |
| Color system refinements | ~10 minutes |
| Final polish & documentation | ~15 minutes |
| **Total** | **~2.5 hours** |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
├── app/
│   ├── globals.css          # Design tokens & Tailwind configuration
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── add-transaction-dialog.tsx
│   ├── budget-card.tsx
│   ├── finance-dashboard.tsx
│   ├── monthly-trend-chart.tsx
│   ├── overview-cards.tsx
│   ├── spending-chart.tsx
│   └── transactions-list.tsx
├── hooks/
│   └── use-finance.ts       # Core finance state management
└── lib/
    ├── types.ts             # TypeScript interfaces
    └── utils.ts             # Utility functions
```

## License

MIT
