// LeetCode API service to fetch user statistics

interface LeetCodeUserStats {
  username: string
  ranking: number
  totalSolved: number
  totalQuestions: number
  easySolved: number
  easyTotal: number
  mediumSolved: number
  mediumTotal: number
  hardSolved: number
  hardTotal: number
  acceptanceRate: number
  submissionCalendar: Record<string, number>
  contributionPoints: number
  reputation: number
  lastUpdated: string
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeUserStats | null> {
  if (!username) return null

  try {
    // In a real implementation, you would use the LeetCode API
    // Since LeetCode doesn't have an official public API, we're simulating the response
    // You could use a serverless function to scrape the data or use a third-party API

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock data based on username
    const hash = hashCode(username)
    const totalSolved = 100 + (hash % 300)
    const totalQuestions = 2500
    const easySolved = Math.floor(totalSolved * 0.5)
    const easyTotal = Math.floor(totalQuestions * 0.4)
    const mediumSolved = Math.floor(totalSolved * 0.4)
    const mediumTotal = Math.floor(totalQuestions * 0.4)
    const hardSolved = Math.floor(totalSolved * 0.1)
    const hardTotal = Math.floor(totalQuestions * 0.2)

    // Generate submission calendar (last 365 days)
    const submissionCalendar: Record<string, number> = {}
    const now = new Date()
    for (let i = 0; i < 365; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = Math.floor(date.getTime() / 1000).toString()

      // Random number of submissions (more likely to be 0)
      const rand = Math.random()
      if (rand > 0.7) {
        submissionCalendar[dateStr] = Math.floor(rand * 10)
      }
    }

    return {
      username,
      ranking: 10000 + (hash % 90000),
      totalSolved,
      totalQuestions,
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
      acceptanceRate: 60 + (hash % 30),
      submissionCalendar,
      contributionPoints: hash % 1000,
      reputation: hash % 100,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error)
    return null
  }
}

// Simple hash function for generating consistent mock data
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export async function syncLeetCodeProblems(username: string): Promise<boolean> {
  // In a real implementation, this would fetch the user's solved problems
  // and sync them with the database

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return success
  return true
}
