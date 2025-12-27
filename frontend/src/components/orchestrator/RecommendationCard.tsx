"use client"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface RecommendationCardProps {
  id: string
  type: string
  priority: "low" | "medium" | "high" | "urgent"
  summary: string
  reasoning: string[]
  estimatedTime: string
  manualTime: string
  confidence: number
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onModify: (id: string) => void
}

const priorityStyles = {
  urgent: "border-red-500 bg-red-50 dark:bg-red-950/20",
  high: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
  medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
  low: "border-slate-300 bg-white dark:bg-slate-900",
}

export function RecommendationCard({
  id, type, priority, summary, reasoning, estimatedTime, manualTime, confidence,
  onApprove, onReject, onModify,
}: RecommendationCardProps) {
  return (
    <div className={cn("border-l-4 rounded-lg p-6", priorityStyles[priority])}>
      <div className="flex justify-between mb-4">
        <div className="flex gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase">{priority}</span>
          <span className="text-xs text-slate-500 uppercase">{type.replace(/_/g, " ")}</span>
        </div>
        <div>
          <div className="text-xs text-slate-500">Confidence</div>
          <div className="text-sm font-semibold">{(confidence * 100).toFixed(0)}%</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-3">{summary}</h3>
      <ul className="space-y-1 mb-4">
        {reasoning.map((r, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="text-indigo-600">•</span>{r}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded">
        <div><div className="text-xs text-slate-500">With AI</div><div className="text-sm font-semibold text-green-600">{estimatedTime}</div></div>
        <div><div className="text-xs text-slate-500">Manual</div><div className="text-sm font-semibold">{manualTime}</div></div>
      </div>
      <div className="flex gap-2">
        <Button variant="success" onClick={() => onApprove(id)} className="flex-1">✓ Approve</Button>
        <Button variant="secondary" onClick={() => onModify(id)}>Modify</Button>
        <Button variant="danger" onClick={() => onReject(id)}>✗ Reject</Button>
      </div>
    </div>
  )
}
