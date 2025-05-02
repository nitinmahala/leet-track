import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { BarChart3, Trophy, Zap, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Track Your <span className="text-leetcode-orange">LeetCode</span> Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Record your progress, visualize your achievements, and improve your problem-solving skills.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button className="px-8 bg-leetcode-orange hover:bg-leetcode-orange/90 text-white">
                    Get Started
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="px-8">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-leetcode-orange/10 px-3 py-1 text-sm text-leetcode-orange">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything you need to master LeetCode
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  LeetTrack helps you organize your practice, track your progress, and prepare for technical interviews.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-leetcode-orange/10 p-3">
                  <BookOpen className="h-6 w-6 text-leetcode-orange" />
                </div>
                <h3 className="text-xl font-bold">Problem Tracking</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Record problems you've solved with notes, difficulty, and topics.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-leetcode-orange/10 p-3">
                  <BarChart3 className="h-6 w-6 text-leetcode-orange" />
                </div>
                <h3 className="text-xl font-bold">Visualizations</h3>
                <p className="text-center text-sm text-muted-foreground">
                  See your progress with beautiful charts and visualizations.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-leetcode-orange/10 p-3">
                  <Zap className="h-6 w-6 text-leetcode-orange" />
                </div>
                <h3 className="text-xl font-bold">Streak Tracking</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Stay motivated with daily streak tracking and consistency metrics.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-leetcode-orange/10 p-3">
                  <Trophy className="h-6 w-6 text-leetcode-orange" />
                </div>
                <h3 className="text-xl font-bold">Contest History</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Track your performance in LeetCode contests and competitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-leetcode-orange/10 px-3 py-1 text-sm text-leetcode-orange">
                    Why LeetTrack?
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Boost your interview preparation</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    LeetTrack helps you organize your LeetCode practice and prepare for technical interviews at top tech
                    companies.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500/20 p-1">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-sm">Track problems by company tags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500/20 p-1">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-sm">Visualize your progress over time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500/20 p-1">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-sm">Identify your strengths and weaknesses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500/20 p-1">
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-sm">Stay motivated with streak tracking</span>
                  </li>
                </ul>
                <div>
                  <Link href="/login">
                    <Button className="bg-leetcode-orange hover:bg-leetcode-orange/90 text-white">
                      Start Tracking Now
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-lg border bg-card p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Your Progress</h3>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[65%] rounded-full bg-leetcode-orange"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 problems</span>
                        <span>2000 problems</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg border bg-background p-3 text-center">
                        <div className="text-2xl font-bold text-leetcode-orange">152</div>
                        <div className="text-xs text-muted-foreground">Easy</div>
                      </div>
                      <div className="rounded-lg border bg-background p-3 text-center">
                        <div className="text-2xl font-bold text-leetcode-orange">98</div>
                        <div className="text-xs text-muted-foreground">Medium</div>
                      </div>
                      <div className="rounded-lg border bg-background p-3 text-center">
                        <div className="text-2xl font-bold text-leetcode-orange">24</div>
                        <div className="text-xs text-muted-foreground">Hard</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current Streak</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-leetcode-orange">7</div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="h-2 w-full rounded-full bg-leetcode-orange"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start tracking?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of developers who use LeetTrack to improve their problem-solving skills.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center">
                <Link href="/login">
                  <Button className="bg-leetcode-orange hover:bg-leetcode-orange/90 text-white px-8">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                No credit card required. Start tracking your progress today.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
