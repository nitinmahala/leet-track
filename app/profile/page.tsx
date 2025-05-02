"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useProblems } from "@/hooks/use-problems"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { LogOut, Github, Twitter, LinkIcon, Calendar, Award, Trophy, Code, BarChart } from "lucide-react"
import { fetchLeetCodeStats } from "@/lib/leetcode-service"
import { useUserSettings } from "@/hooks/use-user-settings"
import { GradientGridBackground } from "@/components/gradient-grid-background"
import { StudyTimer } from "@/components/study-timer"
import { DailyChallenge } from "@/components/daily-challenge"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { problems } = useProblems()
  const { settings } = useUserSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null)
  const [leetcodeLoading, setLeetcodeLoading] = useState(false)
  const router = useRouter()

  useEffect(
    () => {
      // Any toast calls should go here
    },
    [
      /* dependencies */
    ],
  )

  useEffect(() => {
    if (!settings.leetcodeUsername) return

    const fetchLeetCodeData = async () => {
      setLeetcodeLoading(true)
      try {
        const stats = await fetchLeetCodeStats(settings.leetcodeUsername)
        setLeetcodeStats(stats)
      } catch (error) {
        console.error("Error fetching LeetCode stats:", error)
      } finally {
        setLeetcodeLoading(false)
      }
    }

    fetchLeetCodeData()
  }, [settings.leetcodeUsername])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Failed to logout", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats
  const totalProblems = problems.length
  const solvedProblems = problems.filter((p) => p.status === "Solved").length
  const attemptedProblems = problems.filter((p) => p.status === "Attempted").length
  const todoProblems = problems.filter((p) => p.status === "To Do").length

  const easyProblems = problems.filter((p) => p.difficulty === "Easy").length
  const mediumProblems = problems.filter((p) => p.difficulty === "Medium").length
  const hardProblems = problems.filter((p) => p.difficulty === "Hard").length

  // Calculate streak
  const calculateStreak = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get solved problems with dates
    const solvedProblems = problems
      .filter((p) => p.status === "Solved" && p.dateSolved)
      .map((p) => {
        const date = new Date(p.dateSolved!)
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

  const currentStreak = calculateStreak()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GradientGridBackground />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Button variant="outline" className="glass" onClick={() => router.push("/settings")}>
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* User Profile Card */}
            <Card className="glass-card md:col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-leetcode-orange to-leetcode-yellow flex items-center justify-center text-white text-4xl font-bold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{user?.email?.split("@")[0] || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <div className="flex justify-center space-x-2">
                  <Badge variant="outline" className="glass">
                    <Trophy className="mr-1 h-3 w-3" /> {currentStreak} day streak
                  </Badge>
                  <Badge variant="outline" className="glass">
                    <Award className="mr-1 h-3 w-3" /> {solvedProblems} solved
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Member since</span>
                    <span>
                      {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>

                  {settings.leetcodeUsername && (
                    <div className="flex items-center justify-between text-sm">
                      <span>LeetCode</span>
                      <a
                        href={`https://leetcode.com/${settings.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-leetcode-orange"
                      >
                        @{settings.leetcodeUsername} <LinkIcon className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full glass">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full glass">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full glass">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full" onClick={handleLogout} disabled={isLoading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoading ? "Logging out..." : "Log Out"}
                </Button>
              </CardFooter>
            </Card>

            {/* Stats and Activity */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="stats" className="space-y-4">
                <TabsList className="glass">
                  <TabsTrigger value="stats">
                    <BarChart className="mr-2 h-4 w-4" />
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="leetcode">
                    <Code className="mr-2 h-4 w-4" />
                    LeetCode
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    <Calendar className="mr-2 h-4 w-4" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="tools">
                    <Trophy className="mr-2 h-4 w-4" />
                    Tools
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Problem Statistics</CardTitle>
                      <CardDescription>Your LeetCode progress at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Total Problems</p>
                          <p className="text-2xl font-bold">{totalProblems}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Solved</p>
                          <p className="text-2xl font-bold text-green-500">{solvedProblems}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Attempted</p>
                          <p className="text-2xl font-bold text-yellow-500">{attemptedProblems}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">To Do</p>
                          <p className="text-2xl font-bold text-blue-500">{todoProblems}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Difficulty Breakdown</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-500">Easy</span>
                              <span className="text-sm text-green-500">{easyProblems}</span>
                            </div>
                            <Progress
                              value={(easyProblems / (totalProblems || 1)) * 100}
                              className="h-2 bg-muted"
                              indicatorClassName="bg-green-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-yellow-500">Medium</span>
                              <span className="text-sm text-yellow-500">{mediumProblems}</span>
                            </div>
                            <Progress
                              value={(mediumProblems / (totalProblems || 1)) * 100}
                              className="h-2 bg-muted"
                              indicatorClassName="bg-yellow-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-red-500">Hard</span>
                              <span className="text-sm text-red-500">{hardProblems}</span>
                            </div>
                            <Progress
                              value={(hardProblems / (totalProblems || 1)) * 100}
                              className="h-2 bg-muted"
                              indicatorClassName="bg-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
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
                                  <Progress
                                    value={(count / totalProblems) * 100}
                                    className="h-2 w-24 bg-muted"
                                    indicatorClassName="bg-leetcode-orange"
                                  />
                                  <span className="text-xs">{count}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leetcode">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>LeetCode Statistics</CardTitle>
                      <CardDescription>
                        {settings.leetcodeUsername
                          ? `Statistics from your LeetCode profile (@${settings.leetcodeUsername})`
                          : "Connect your LeetCode account in settings"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!settings.leetcodeUsername ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <Code className="h-12 w-12 text-muted-foreground" />
                          <div className="text-center">
                            <h3 className="text-lg font-medium">No LeetCode account connected</h3>
                            <p className="text-sm text-muted-foreground">
                              Connect your LeetCode account to see your statistics
                            </p>
                          </div>
                          <Button
                            onClick={() => router.push("/settings?tab=leetcode")}
                            className="gradient-button hover-lift"
                          >
                            Connect Account
                          </Button>
                        </div>
                      ) : leetcodeLoading ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-8 w-[100px]" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                          </div>
                          <Skeleton className="h-[100px]" />
                        </div>
                      ) : leetcodeStats ? (
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Global Ranking</p>
                              <p className="text-2xl font-bold">{leetcodeStats.ranking.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                              <p className="text-2xl font-bold">{leetcodeStats.acceptanceRate}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Contribution Points</p>
                              <p className="text-2xl font-bold">{leetcodeStats.contributionPoints}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Problems Solved</h3>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="glass p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold">{leetcodeStats.totalSolved}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                              </div>
                              <div className="glass p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-500">{leetcodeStats.easySolved}</p>
                                <p className="text-xs text-muted-foreground">Easy</p>
                              </div>
                              <div className="glass p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-yellow-500">{leetcodeStats.mediumSolved}</p>
                                <p className="text-xs text-muted-foreground">Medium</p>
                              </div>
                              <div className="glass p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-red-500">{leetcodeStats.hardSolved}</p>
                                <p className="text-xs text-muted-foreground">Hard</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Progress</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-500">Easy</span>
                                  <span className="text-sm text-green-500">
                                    {leetcodeStats.easySolved} / {leetcodeStats.easyTotal}
                                  </span>
                                </div>
                                <Progress
                                  value={(leetcodeStats.easySolved / leetcodeStats.easyTotal) * 100}
                                  className="h-2 bg-muted"
                                  indicatorClassName="bg-green-500"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-yellow-500">Medium</span>
                                  <span className="text-sm text-yellow-500">
                                    {leetcodeStats.mediumSolved} / {leetcodeStats.mediumTotal}
                                  </span>
                                </div>
                                <Progress
                                  value={(leetcodeStats.mediumSolved / leetcodeStats.mediumTotal) * 100}
                                  className="h-2 bg-muted"
                                  indicatorClassName="bg-yellow-500"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-red-500">Hard</span>
                                  <span className="text-sm text-red-500">
                                    {leetcodeStats.hardSolved} / {leetcodeStats.hardTotal}
                                  </span>
                                </div>
                                <Progress
                                  value={(leetcodeStats.hardSolved / leetcodeStats.hardTotal) * 100}
                                  className="h-2 bg-muted"
                                  indicatorClassName="bg-red-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-medium">Failed to load LeetCode stats</h3>
                            <p className="text-sm text-muted-foreground">Please check your username and try again</p>
                          </div>
                          <Button
                            onClick={() => router.push("/settings?tab=leetcode")}
                            className="gradient-button hover-lift"
                          >
                            Update Settings
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent problem-solving activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Activity Heatmap</h3>
                          <div className="bg-muted/30 p-4 rounded-lg">
                            {problems.length > 0 ? (
                              <div className="space-y-2">
                                <div className="grid grid-cols-[repeat(52,1fr)] gap-1">
                                  {Array.from({ length: 52 * 7 }).map((_, i) => {
                                    const date = new Date()
                                    date.setDate(date.getDate() - (52 * 7 - i))
                                    const dateStr = date.toISOString().split("T")[0]

                                    const problemsOnDay = problems.filter(
                                      (p) => p.dateSolved && p.dateSolved.startsWith(dateStr),
                                    ).length

                                    let bgClass = "bg-muted"
                                    if (problemsOnDay > 0) {
                                      if (problemsOnDay >= 5) bgClass = "bg-green-500"
                                      else if (problemsOnDay >= 3) bgClass = "bg-green-400"
                                      else if (problemsOnDay >= 2) bgClass = "bg-green-300"
                                      else bgClass = "bg-green-200"
                                    }

                                    return (
                                      <div
                                        key={i}
                                        className={`h-3 w-3 rounded-sm ${bgClass}`}
                                        title={`${dateStr}: ${problemsOnDay} problems`}
                                      />
                                    )
                                  })}
                                </div>
                                <div className="flex items-center justify-end space-x-2">
                                  <div className="text-xs text-muted-foreground">Less</div>
                                  <div className="h-3 w-3 rounded-sm bg-muted" />
                                  <div className="h-3 w-3 rounded-sm bg-green-200" />
                                  <div className="h-3 w-3 rounded-sm bg-green-300" />
                                  <div className="h-3 w-3 rounded-sm bg-green-400" />
                                  <div className="h-3 w-3 rounded-sm bg-green-500" />
                                  <div className="text-xs text-muted-foreground">More</div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8">
                                <p className="text-muted-foreground">No activity data yet</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Recent Problems</h3>
                          {problems.length > 0 ? (
                            <div className="space-y-2">
                              {problems
                                .sort((a, b) => {
                                  const dateA = a.dateSolved ? new Date(a.dateSolved).getTime() : 0
                                  const dateB = b.dateSolved ? new Date(b.dateSolved).getTime() : 0
                                  return dateB - dateA
                                })
                                .slice(0, 5)
                                .map((problem) => (
                                  <div key={problem.id} className="glass p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <a
                                          href={problem.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium hover:text-leetcode-orange"
                                        >
                                          {problem.title}
                                        </a>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={
                                              problem.difficulty === "Easy"
                                                ? "text-green-500 border-green-500"
                                                : problem.difficulty === "Medium"
                                                  ? "text-yellow-500 border-yellow-500"
                                                  : "text-red-500 border-red-500"
                                            }
                                          >
                                            {problem.difficulty}
                                          </Badge>
                                          <Badge variant="outline">{problem.topic}</Badge>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <Badge
                                          className={
                                            problem.status === "Solved"
                                              ? "bg-green-500/10 text-green-500"
                                              : problem.status === "Attempted"
                                                ? "bg-yellow-500/10 text-yellow-500"
                                                : "bg-blue-500/10 text-blue-500"
                                          }
                                        >
                                          {problem.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {problem.dateSolved
                                            ? new Date(problem.dateSolved).toLocaleDateString()
                                            : "No date"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                              <p className="text-muted-foreground">No problems solved yet</p>
                              <Button
                                onClick={() => router.push("/dashboard?tab=add")}
                                className="mt-4 gradient-button hover-lift"
                              >
                                Add Your First Problem
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tools">
                  <div className="grid gap-6 md:grid-cols-2">
                    <StudyTimer />
                    <DailyChallenge />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
