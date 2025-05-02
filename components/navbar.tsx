"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { BarChart, Code2, Home, ListTodo, LogOut, Menu, PlusCircle, Search, Settings, Trophy, User } from "lucide-react"
import { useProblems } from "@/hooks/use-problems"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { problems } = useProblems()

  // Calculate streak
  const currentStreak = problems.length > 0 ? calculateStreak(problems) : 0

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: ListTodo },
    { name: "Visualize", href: "/visualize", icon: BarChart },
    { name: "Companies", href: "/companies", icon: Code2 },
    { name: "Contests", href: "/contests", icon: Trophy },
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "glass-navbar" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden neu-button rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-leetcode-orange" />
                  <span>LeetTrack</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/20 ${
                      pathname === link.href ? "bg-white/10 font-medium" : ""
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      href="/dashboard?tab=add"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/20"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Problem</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/20"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-leetcode-orange" />
            <span className="text-xl font-bold">LeetTrack</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover-lift ${
                pathname === link.href ? "bg-white/10 dark:bg-white/5" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 glass rounded-full">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Streak:</span>
                <span className="text-xs font-bold text-leetcode-orange">{currentStreak} days</span>
              </div>
            </div>
          )}

          <Button variant="ghost" size="icon" className="text-foreground neu-button rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover-glow">
                  <Avatar className="h-8 w-8 gradient-primary">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <ListTodo className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add Problem</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="gradient-button rounded-full hover-lift">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// Helper function to calculate streak
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
