"use client"

import { useFinance } from "@/hooks/use-finance"
import { OverviewCards } from "@/components/overview-cards"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { TransactionsList } from "@/components/transactions-list"
import { BudgetCard } from "@/components/budget-card"
import { SpendingChart } from "@/components/spending-chart"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet } from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  )
}

export function FinanceDashboard() {
  const {
    transactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateBudget,
    getMonthlyTransactions,
    getMonthlyTotals,
    getCategoryTotals,
    getBudgetStatus,
  } = useFinance()

  if (!isLoaded) {
    return <DashboardSkeleton />
  }

  const monthlyTotals = getMonthlyTotals()
  const monthlyTransactions = getMonthlyTransactions()
  const categoryTotals = getCategoryTotals("expense")
  const budgetStatus = getBudgetStatus()

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Financial Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">{currentMonth}</p>
        </div>
        <AddTransactionDialog onAdd={addTransaction} />
      </div>

      <OverviewCards
        income={monthlyTotals.income}
        expenses={monthlyTotals.expenses}
        balance={monthlyTotals.balance}
      />

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2">Transactions</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs sm:text-sm py-2">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <SpendingChart categoryTotals={categoryTotals} />
            <MonthlyTrendChart transactions={transactions} />
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <TransactionsList
              transactions={monthlyTransactions.slice(0, 5)}
              onDelete={deleteTransaction}
            />
            <BudgetCard
              budgetStatus={budgetStatus}
              onUpdateBudget={updateBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsList
            transactions={monthlyTransactions}
            onDelete={deleteTransaction}
          />
        </TabsContent>

        <TabsContent value="budget">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <BudgetCard
              budgetStatus={budgetStatus}
              onUpdateBudget={updateBudget}
            />
            <SpendingChart categoryTotals={categoryTotals} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
