export interface Problem {
  id: string
  title: string
  url: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  status: "Solved" | "Attempted" | "To Do"
  notes?: string
  dateSolved?: string
  createdAt: string
  updatedAt: string
  companyTags?: string[]
  timeComplexity?: string
  spaceComplexity?: string
  contestId?: string
}

export interface Contest {
  id: string
  title: string
  date: string
  rank?: number
  score?: number
  problemsSolved?: number
  totalProblems?: number
  notes?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  problemCount: number
}

export interface UserSettings {
  id: string
  userId: string
  dailyGoal: number
  weeklyGoal: number
  emailNotifications: boolean
  theme: "light" | "dark" | "system"
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  currentStreak: number
  longestStreak: number
  lastActive: string
  topTopics: { topic: string; count: number }[]
}
