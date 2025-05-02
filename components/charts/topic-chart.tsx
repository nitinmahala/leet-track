"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Problem } from "@/lib/types"

interface TopicChartProps {
  problems: Problem[]
}

export function TopicChart({ problems }: TopicChartProps) {
  const data = useMemo(() => {
    const topicCount: Record<string, number> = {}

    problems.forEach((problem) => {
      if (problem.status === "Solved") {
        topicCount[problem.topic] = (topicCount[problem.topic] || 0) + 1
      }
    })

    return Object.entries(topicCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
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
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} problems`, "Count"]} />
          <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
