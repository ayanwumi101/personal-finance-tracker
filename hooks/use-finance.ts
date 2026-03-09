"use client"

import { useState, useEffect, useCallback } from "react"
import type { Transaction, Budget, FinanceState, Category, TransactionType } from "@/lib/types"
import { EXPENSE_CATEGORIES } from "@/lib/types"

const STORAGE_KEY = "finance-tracker-data"

const DEFAULT_BUDGETS: Budget[] = EXPENSE_CATEGORIES.map((category) => ({
  category,
  limit: 500,
}))

// Sample transactions to make the app feel alive
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 4500,
    category: "salary",
    description: "Monthly salary",
    date: new Date().toISOString().split("T")[0],
    type: "income",
  },
  {
    id: "2",
    amount: 85.50,
    category: "food",
    description: "Weekly groceries",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    type: "expense",
  },
  {
    id: "3",
    amount: 45.00,
    category: "transportation",
    description: "Gas fill up",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    type: "expense",
  },
  {
    id: "4",
    amount: 120.00,
    category: "shopping",
    description: "New headphones",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    type: "expense",
  },
  {
    id: "5",
    amount: 150.00,
    category: "bills",
    description: "Electric bill",
    date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0],
    type: "expense",
  },
  {
    id: "6",
    amount: 35.00,
    category: "entertainment",
    description: "Movie tickets",
    date: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
    type: "expense",
  },
  {
    id: "7",
    amount: 500,
    category: "freelance",
    description: "Website design project",
    date: new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0],
    type: "income",
  },
]

function getInitialState(): FinanceState {
  if (typeof window === "undefined") {
    return {
      transactions: SAMPLE_TRANSACTIONS,
      budgets: DEFAULT_BUDGETS,
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as FinanceState
      return {
        transactions: parsed.transactions || [],
        budgets: parsed.budgets || DEFAULT_BUDGETS,
      }
    }
  } catch {
    console.error("Error loading from localStorage")
  }

  return {
    transactions: SAMPLE_TRANSACTIONS,
    budgets: DEFAULT_BUDGETS,
  }
}

export function useFinance() {
  const [state, setState] = useState<FinanceState>(getInitialState)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setState(getInitialState())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoaded])

  const addTransaction = useCallback(
    (transaction: Omit<Transaction, "id">) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
      }
      setState((prev) => ({
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
      }))
    },
    []
  )

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
  }, [])

  const updateBudget = useCallback((category: Category, limit: number) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.category === category ? { ...b, limit } : b
      ),
    }))
  }, [])

  const getMonthlyTransactions = useCallback(
    (month?: number, year?: number) => {
      const now = new Date()
      const targetMonth = month ?? now.getMonth()
      const targetYear = year ?? now.getFullYear()

      return state.transactions.filter((t) => {
        const date = new Date(t.date)
        return (
          date.getMonth() === targetMonth && date.getFullYear() === targetYear
        )
      })
    },
    [state.transactions]
  )

  const getMonthlyTotals = useCallback(
    (month?: number, year?: number) => {
      const transactions = getMonthlyTransactions(month, year)
      
      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
      
      return { income, expenses, balance: income - expenses }
    },
    [getMonthlyTransactions]
  )

  const getCategoryTotals = useCallback(
    (type: TransactionType, month?: number, year?: number) => {
      const transactions = getMonthlyTransactions(month, year)
      
      const totals: Record<Category, number> = {} as Record<Category, number>
      
      transactions
        .filter((t) => t.type === type)
        .forEach((t) => {
          totals[t.category] = (totals[t.category] || 0) + t.amount
        })
      
      return totals
    },
    [getMonthlyTransactions]
  )

  const getBudgetStatus = useCallback(
    (month?: number, year?: number) => {
      const expenseTotals = getCategoryTotals("expense", month, year)
      
      return state.budgets.map((budget) => ({
        ...budget,
        spent: expenseTotals[budget.category] || 0,
        remaining: budget.limit - (expenseTotals[budget.category] || 0),
        percentage: Math.min(
          100,
          ((expenseTotals[budget.category] || 0) / budget.limit) * 100
        ),
        isOver: (expenseTotals[budget.category] || 0) > budget.limit,
      }))
    },
    [state.budgets, getCategoryTotals]
  )

  return {
    transactions: state.transactions,
    budgets: state.budgets,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateBudget,
    getMonthlyTransactions,
    getMonthlyTotals,
    getCategoryTotals,
    getBudgetStatus,
  }
}
