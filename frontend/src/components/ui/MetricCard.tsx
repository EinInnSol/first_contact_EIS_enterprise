import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: "up" | "down"
  }
  status?: "positive" | "negative" | "neutral"
  className?: string
}

export function MetricCard({ label, value, trend, status, className }: MetricCardProps) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow", className)}>
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="font-mono text-4xl font-bold text-slate-900 dark:text-cyan-500">
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-sm font-medium">
          <span className={cn(
            status === "positive" ? "text-green-600" : 
            status === "negative" ? "text-red-600" : 
            "text-slate-600"
          )}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
          </span>
          <span className="text-slate-500 text-xs">vs last period</span>
        </div>
      )}
    </div>
  )
}
