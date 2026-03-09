import { FinanceDashboard } from "@/components/finance-dashboard"
import { Wallet } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-semibold text-base sm:text-lg">Finance Snapshot</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <FinanceDashboard />
      </div>
    </main>
  )
}
