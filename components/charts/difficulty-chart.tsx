"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Problem } from "@/lib/types"

interface DifficultyChartProps {
  problems: Problem[]
}

export function DifficultyChart({ problems }: DifficultyChartProps) {
  const data = useMemo(() => {
    const difficultyCount = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    }

    problems.forEach((problem) => {
      if (problem.status === "Solved") {
        difficultyCount[problem.difficulty as keyof typeof difficultyCount]++
      }
    })

    return [
      { name: "Easy", value: difficultyCount.Easy, color: "#10b981" },
      { name: "Medium", value: difficultyCount.Medium, color: "#f59e0b" },
      { name: "Hard", value: difficultyCount.Hard, color: "#ef4444" },
    ]
  }, [problems])

  if (data.every((item) => item.value === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No solved problems yet</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} problems`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
