import Link from "next/link"
import { Code2, Github, Heart, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="glass-card mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-leetcode-orange" />
              <span className="text-xl font-bold">LeetTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your LeetCode journey, visualize your progress, and improve your problem-solving skills.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Features</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Problem Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/visualize"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visualizations
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Company Tags
                </Link>
              </li>
              <li>
                <Link
                  href="/contests"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contest Tracking
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LeetCode
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/topics/leetcode-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub Solutions
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/results?search_query=leetcode+patterns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Video Tutorials
                </a>
              </li>
              <li>
                <a
                  href="https://www.techinterviewhandbook.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Interview Handbook
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Connect</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} LeetTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>by LeetTrack Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
