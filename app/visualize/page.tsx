"use client"

import { useProblems } from "@/hooks/use-problems"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DifficultyChart } from "@/components/charts/difficulty-chart"
import { TopicChart } from "@/components/charts/topic-chart"
import { TimelineChart } from "@/components/charts/timeline-chart"
import { ActivityHeatmap } from "@/components/charts/activity-heatmap"
import { Navbar } from "@/components/navbar"
import { GradientGridBackground } from "@/components/gradient-grid-background"
import { StudyTimer } from "@/components/study-timer"

export default function VisualizePage() {
  const { problems, loading } = useProblems()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <GradientGridBackground />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-leetcode-orange"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GradientGridBackground />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Visualizations</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="glass-card hover-lift md:col-span-2">
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>Problems solved by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <DifficultyChart problems={problems} />
              </CardContent>
            </Card>

            <StudyTimer />

            <Card className="glass-card hover-lift md:col-span-2">
              <CardHeader>
                <CardTitle>Topics</CardTitle>
                <CardDescription>Problems solved by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <TopicChart problems={problems} />
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle>Study Streak</CardTitle>
                <CardDescription>Your consistency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold text-leetcode-orange">{calculateStreak(problems)} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">{getProblemsThisWeek(problems)} problems</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Last 7 Days</p>
                    <div className="flex gap-1">
                      {getLast7DaysActivity(problems).map((active, i) => (
                        <div
                          key={i}
                          className={`h-2 w-full rounded-full ${active ? "bg-leetcode-orange" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift md:col-span-3">
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Problems solved over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineChart problems={problems} />
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift md:col-span-3">
              <CardHeader>
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>Your problem-solving activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap problems={problems} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper functions
function calculateStreak(problems: any[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get solved problems with dates
  const solvedProblems = problems
    .filter((p) => p.status === "Solved" && p.dateSolved)
    .map((p) => {
      const date = new Date(p.dateSolved)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    .sort((a, b) => b - a) // Sort descending

  if (solvedProblems.length === 0) return 0

  // Check if solved today
  const todayTime = today.getTime()
  const hasSolvedToday = solvedProblems.includes(todayTime)

  // If not solved today, check if solved yesterday to continue streak
  if (!hasSolvedToday) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayTime = yesterday.getTime()

    if (!solvedProblems.includes(yesterdayTime)) {
      return 0 // Streak broken
    }
  }

  // Calculate streak
  let streak = hasSolvedToday ? 1 : 0
  const currentDate = hasSolvedToday ? today : new Date(today)
  currentDate.setDate(currentDate.getDate() - 1)

  while (true) {
    const currentTime = currentDate.getTime()
    if (solvedProblems.includes(currentTime)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

function getProblemsThisWeek(problems: any[]): number {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0)

  return problems.filter((p) => {
    if (!p.dateSolved) return false
    const solvedDate = new Date(p.dateSolved)
    return solvedDate >= startOfWeek
  }).length
}

function getLast7DaysActivity(problems: any[]): boolean[] {
  const result = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dateStr = date.toISOString().split("T")[0]
    const hasActivity = problems.some((p) => p.dateSolved && p.dateSolved.startsWith(dateStr))

    result.push(hasActivity)
  }

  return result
}
