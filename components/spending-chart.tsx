"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import type { Category } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_COLORS, EXPENSE_CATEGORIES } from "@/lib/types"

interface SpendingChartProps {
  categoryTotals: Partial<Record<Category, number>>
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SpendingChart({ categoryTotals }: SpendingChartProps) {
  const data = EXPENSE_CATEGORIES
    .filter((category) => (categoryTotals[category] || 0) > 0)
    .map((category) => ({
      name: CATEGORY_LABELS[category],
      value: categoryTotals[category] || 0,
      category,
      fill: CATEGORY_COLORS[category],
    }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const chartConfig = EXPENSE_CATEGORIES.reduce((acc, category) => {
    acc[category] = {
      label: CATEGORY_LABELS[category],
      color: CATEGORY_COLORS[category],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Where your money goes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
            <p className="text-muted-foreground">No expenses yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add expenses to see your spending breakdown
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Spending Breakdown</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Where your money goes</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  className="stroke-background stroke-2"
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="mt-2 sm:mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-1.5 text-[10px] sm:text-xs">
              <div 
                className="h-2 w-2 sm:h-3 sm:w-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Spending</p>
          <p className="text-xl sm:text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
