"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, CheckCircle, ExternalLink } from "lucide-react"

interface DailyChallenge {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  url: string
  date: string
  completed: boolean
}

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get daily challenge
    const fetchDailyChallenge = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate a random challenge
        const difficulties: Array<"Easy" | "Medium" | "Hard"> = ["Easy", "Medium", "Hard"]
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]

        const titles = [
          "Two Sum",
          "Valid Parentheses",
          "Merge Two Sorted Lists",
          "Maximum Subarray",
          "Climbing Stairs",
          "Binary Tree Inorder Traversal",
          "Symmetric Tree",
          "Maximum Depth of Binary Tree",
          "Convert Sorted Array to Binary Search Tree",
          "Pascal's Triangle",
        ]
        const randomTitle = titles[Math.floor(Math.random() * titles.length)]

        setChallenge({
          id: Math.random().toString(36).substring(2, 9),
          title: randomTitle,
          difficulty: randomDifficulty,
          url: `https://leetcode.com/problems/${randomTitle.toLowerCase().replace(/\s+/g, "-")}/`,
          date: new Date().toISOString().split("T")[0],
          completed: Math.random() > 0.5, // Randomly set as completed or not
        })
      } catch (error) {
        console.error("Error fetching daily challenge:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyChallenge()
  }, [])

  const handleMarkComplete = () => {
    if (challenge) {
      setChallenge({ ...challenge, completed: true })
    }
  }

  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Challenge</span>
          <Calendar className="h-5 w-5 text-leetcode-orange" />
        </CardTitle>
        <CardDescription>Solve one problem every day to maintain your streak</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : challenge ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{challenge.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  className={
                    challenge.difficulty === "Easy"
                      ? "bg-green-500/10 text-green-500"
                      : challenge.difficulty === "Medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                  }
                >
                  {challenge.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(challenge.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm">
                Complete today's challenge to maintain your streak and improve your problem-solving skills.
              </p>
            </div>

            {challenge.completed && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>You've completed today's challenge!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">Failed to load daily challenge</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {challenge && (
          <>
            <Button variant="outline" className="glass" onClick={handleMarkComplete} disabled={challenge.completed}>
              {challenge.completed ? "Completed" : "Mark as Complete"}
            </Button>
            <Button asChild className="gradient-button">
              <a href={challenge.url} target="_blank" rel="noopener noreferrer">
                Solve <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
