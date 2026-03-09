export type TransactionType = "income" | "expense"

export type Category = 
  | "food"
  | "transportation" 
  | "shopping"
  | "entertainment"
  | "bills"
  | "salary"
  | "freelance"
  | "other"

export interface Transaction {
  id: string
  amount: number
  category: Category
  description: string
  date: string
  type: TransactionType
}

export interface Budget {
  category: Category
  limit: number
}

export interface FinanceState {
  transactions: Transaction[]
  budgets: Budget[]
}

export const EXPENSE_CATEGORIES: Category[] = [
  "food",
  "transportation",
  "shopping",
  "entertainment",
  "bills",
]

export const INCOME_CATEGORIES: Category[] = [
  "salary",
  "freelance",
  "other",
]

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food & Dining",
  transportation: "Transportation",
  shopping: "Shopping",
  entertainment: "Entertainment",
  bills: "Bills & Utilities",
  salary: "Salary",
  freelance: "Freelance",
  other: "Other",
}

export const CATEGORY_COLORS: Record<Category, string> = {
  food: "var(--chart-1)",
  transportation: "var(--chart-2)",
  shopping: "var(--chart-3)",
  entertainment: "var(--chart-4)",
  bills: "var(--chart-5)",
  salary: "var(--success)",
  freelance: "var(--accent)",
  other: "var(--muted-foreground)",
}
