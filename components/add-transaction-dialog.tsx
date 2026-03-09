"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Transaction, TransactionType, Category } from "@/lib/types"
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_LABELS,
} from "@/lib/types"

interface AddTransactionDialogProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void
}

export function AddTransactionDialog({ onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<Category | "">("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !category || !description || !date) return

    onAdd({
      amount: parseFloat(amount),
      category: category as Category,
      description,
      date,
      type,
    })

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    setType("expense")
    setOpen(false)
  }

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Add Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Add Transaction</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Add a new income or expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-4">
            <div className="grid gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === "expense" ? "default" : "outline"}
                  className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                  onClick={() => handleTypeChange("expense")}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={type === "income" ? "default" : "outline"}
                  className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                  onClick={() => handleTypeChange("income")}
                >
                  Income
                </Button>
              </div>
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="amount" className="text-xs sm:text-sm">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-9 sm:h-10"
              />
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as Category)}
                required
              >
                <SelectTrigger className="h-9 sm:h-10 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="h-9 sm:h-10"
              />
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="date" className="text-xs sm:text-sm">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-9 sm:h-10"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!amount || !category || !description} className="w-full sm:w-auto order-1 sm:order-2">
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
