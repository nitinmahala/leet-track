"use client"

import { useMemo } from "react"
import type { Problem } from "@/lib/types"

interface ActivityHeatmapProps {
  problems: Problem[]
}

interface DayData {
  date: string
  count: number
}

export function ActivityHeatmap({ problems }: ActivityHeatmapProps) {
  const data = useMemo(() => {
    const solvedProblems = problems.filter((p) => p.status === "Solved" && p.dateSolved)

    const dateMap = new Map<string, number>()

    solvedProblems.forEach((problem) => {
      const date = new Date(problem.dateSolved!).toISOString().split("T")[0]
      dateMap.set(date, (dateMap.get(date) || 0) + 1)
    })

    // Get last 365 days
    const days: DayData[] = []
    const today = new Date()

    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      days.unshift({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
      })
    }

    return days
  }, [problems])

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count < 2) return "bg-green-200 dark:bg-green-900"
    if (count < 4) return "bg-green-300 dark:bg-green-800"
    if (count < 6) return "bg-green-400 dark:bg-green-700"
    return "bg-green-500 dark:bg-green-600"
  }

  const months = useMemo(() => {
    const result = []
    const today = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(today)
      date.setMonth(date.getMonth() - i)
      result.unshift(date.toLocaleDateString(undefined, { month: "short" }))
    }

    return [...new Set(result)]
  }, [])

  if (data.every((day) => day.count === 0)) {
    return (
      <div className="flex h-[150px] items-center justify-center">
        <p className="text-muted-foreground">No activity data yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-start space-x-2 overflow-x-auto pb-2">
        {months.map((month, i) => (
          <div key={i} className="text-xs text-muted-foreground">
            {month}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(52,1fr)] gap-1">
        {data.map((day, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${getColor(day.count)}`}
            title={`${day.date}: ${day.count} problems`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="text-xs text-muted-foreground">Less</div>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
        <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-800" />
        <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
        <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
        <div className="text-xs text-muted-foreground">More</div>
      </div>
    </div>
  )
}
