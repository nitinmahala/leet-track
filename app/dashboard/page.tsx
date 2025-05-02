"use client"

import { useState } from "react"
import { ProblemForm } from "@/components/problem-form"
import { ProblemList } from "@/components/problem-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProblems } from "@/hooks/use-problems"
import { BarChart, ListTodo, PlusCircle } from "lucide-react"
import { GradientGridBackground } from "@/components/gradient-grid-background"
import { DailyChallenge } from "@/components/daily-challenge"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("add")
  const { problems, loading, addProblem, updateProblem, deleteProblem } = useProblems()

  // Calculate stats
  const totalProblems = problems.length
  const solvedProblems = problems.filter((p) => p.status === "Solved").length
  const attemptedProblems = problems.filter((p) => p.status === "Attempted").length
  const todoProblems = problems.filter((p) => p.status === "To Do").length

  return (
    <div className="space-y-6">
      <GradientGridBackground />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-4 gap-3">
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalProblems}</p>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Solved</p>
              <p className="text-2xl font-bold text-green-500">{solvedProblems}</p>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Attempted</p>
              <p className="text-2xl font-bold text-leetcode-orange">{attemptedProblems}</p>
            </CardContent>
          </Card>
          <Card className="glass-card hover-lift">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">To Do</p>
              <p className="text-2xl font-bold text-leetcode-blue">{todoProblems}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="add" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="glass w-full justify-start">
              <TabsTrigger value="add" className="data-[state=active]:gradient-primary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Problem
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:gradient-primary">
                <ListTodo className="mr-2 h-4 w-4" />
                My Problems
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:gradient-primary">
                <BarChart className="mr-2 h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Add New Problem</CardTitle>
                  <CardDescription>Record a new LeetCode problem you've solved or attempted</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProblemForm onSubmit={addProblem} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="list">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>My Problems</CardTitle>
                  <CardDescription>View and manage your recorded LeetCode problems</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProblemList problems={problems} loading={loading} onEdit={updateProblem} onDelete={deleteProblem} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Problem Statistics</CardTitle>
                  <CardDescription>Overview of your LeetCode progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Difficulty Breakdown</h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md glass p-2">
                          <p className="text-xs font-medium text-green-500">Easy</p>
                          <p className="text-lg font-bold text-green-500">
                            {problems.filter((p) => p.difficulty === "Easy").length}
                          </p>
                        </div>
                        <div className="rounded-md glass p-2">
                          <p className="text-xs font-medium text-leetcode-orange">Medium</p>
                          <p className="text-lg font-bold text-leetcode-orange">
                            {problems.filter((p) => p.difficulty === "Medium").length}
                          </p>
                        </div>
                        <div className="rounded-md glass p-2">
                          <p className="text-xs font-medium text-red-500">Hard</p>
                          <p className="text-lg font-bold text-red-500">
                            {problems.filter((p) => p.difficulty === "Hard").length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Top Topics</h3>
                      <div className="space-y-2">
                        {Object.entries(
                          problems.reduce((acc: Record<string, number>, problem) => {
                            acc[problem.topic] = (acc[problem.topic] || 0) + 1
                            return acc
                          }, {}),
                        )
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([topic, count]) => (
                            <div key={topic} className="flex items-center justify-between">
                              <span className="text-sm">{topic}</span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-leetcode-orange rounded-full"
                                    style={{ width: `${(count / problems.length) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <DailyChallenge />
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Improve your problem-solving skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted/30 p-3">
                  <h4 className="font-medium">Pattern Recognition</h4>
                  <p className="text-sm text-muted-foreground">
                    Look for common patterns like sliding window, two pointers, or dynamic programming.
                  </p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <h4 className="font-medium">Time Complexity</h4>
                  <p className="text-sm text-muted-foreground">
                    Always analyze your solution's time and space complexity before submitting.
                  </p>
                </div>
                <div className="rounded-md bg-muted/30 p-3">
                  <h4 className="font-medium">Edge Cases</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your solution with empty arrays, single elements, and boundary values.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
