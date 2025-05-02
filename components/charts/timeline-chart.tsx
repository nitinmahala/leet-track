"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Problem } from "@/lib/types"

interface TimelineChartProps {
  problems: Problem[]
}

export function TimelineChart({ problems }: TimelineChartProps) {
  const data = useMemo(() => {
    const solvedProblems = problems
      .filter((p) => p.status === "Solved" && p.dateSolved)
      .sort((a, b) => new Date(a.dateSolved!).getTime() - new Date(b.dateSolved!).getTime())

    if (solvedProblems.length === 0) return []

    const dateMap = new Map<string, number>()
    let cumulativeCount = 0

    solvedProblems.forEach((problem) => {
      const date = new Date(problem.dateSolved!).toISOString().split("T")[0]
      cumulativeCount++
      dateMap.set(date, cumulativeCount)
    })

    return Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))
  }, [problems])

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No solved problems yet</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [`${value} problems`, "Total Solved"]}
          />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
