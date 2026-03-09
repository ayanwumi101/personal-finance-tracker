"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Category } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BudgetStatus {
  category: Category
  limit: number
  spent: number
  remaining: number
  percentage: number
  isOver: boolean
}

interface BudgetCardProps {
  budgetStatus: BudgetStatus[]
  onUpdateBudget: (category: Category, limit: number) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function BudgetItem({ 
  budget, 
  onUpdate 
}: { 
  budget: BudgetStatus
  onUpdate: (limit: number) => void 
}) {
  const [open, setOpen] = useState(false)
  const [newLimit, setNewLimit] = useState(budget.limit.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const limit = parseFloat(newLimit)
    if (limit > 0) {
      onUpdate(limit)
      setOpen(false)
    }
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium">{CATEGORY_LABELS[budget.category]}</span>
          {budget.isOver ? (
            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
          ) : budget.percentage >= 80 ? (
            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-chart-3" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Settings2 className="h-3 w-3" />
              <span className="sr-only">Edit budget</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[300px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Edit Budget</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Set monthly limit for {CATEGORY_LABELS[budget.category]}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full sm:w-auto">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Progress 
        value={budget.percentage} 
        className={cn(
          "h-1.5 sm:h-2",
          budget.isOver && "[&>div]:bg-destructive",
          budget.percentage >= 80 && !budget.isOver && "[&>div]:bg-chart-3"
        )}
      />
      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
        <span>
          {formatCurrency(budget.spent)} spent
        </span>
        <span className={cn(budget.isOver && "text-destructive font-medium")}>
          {budget.isOver 
            ? `${formatCurrency(Math.abs(budget.remaining))} over` 
            : `${formatCurrency(budget.remaining)} left`
          }
        </span>
      </div>
    </div>
  )
}

export function BudgetCard({ budgetStatus, onUpdateBudget }: BudgetCardProps) {
  const overBudgetCount = budgetStatus.filter((b) => b.isOver).length
  const warningCount = budgetStatus.filter((b) => !b.isOver && b.percentage >= 80).length

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Budget Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {overBudgetCount > 0 
                ? `${overBudgetCount} ${overBudgetCount === 1 ? 'category' : 'categories'} over budget`
                : warningCount > 0
                  ? `${warningCount} ${warningCount === 1 ? 'category' : 'categories'} near limit`
                  : "All categories on track"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4 sm:space-y-6">
        {budgetStatus.map((budget) => (
          <BudgetItem
            key={budget.category}
            budget={budget}
            onUpdate={(limit) => onUpdateBudget(budget.category, limit)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
