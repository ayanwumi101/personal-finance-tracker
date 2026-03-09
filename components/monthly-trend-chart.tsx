"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/lib/types"

interface MonthlyTrendChartProps {
  transactions: Transaction[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function MonthlyTrendChart({ transactions }: MonthlyTrendChartProps) {
  // Get last 6 months of data
  const now = new Date()
  const months: { month: string; income: number; expenses: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = date.toLocaleDateString("en-US", { month: "short" })
    
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
    })

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    months.push({ month: monthKey, income, expenses })
  }

  const chartConfig = {
    income: {
      label: "Income",
      color: "var(--success)",
    },
    expenses: {
      label: "Expenses",
      color: "var(--destructive)",
    },
  }

  const hasData = months.some((m) => m.income > 0 || m.expenses > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Income vs expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
            <p className="text-muted-foreground">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add transactions to see your monthly trends
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Income vs expenses over time</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full">
          <BarChart data={months} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={35}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
            <Bar 
              dataKey="income" 
              fill="var(--success)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar 
              dataKey="expenses" 
              fill="var(--destructive)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-success" />
            <span className="text-xs sm:text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-destructive" />
            <span className="text-xs sm:text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
