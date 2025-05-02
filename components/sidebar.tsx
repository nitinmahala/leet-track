"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Code2, Home, ListTodo, PlusCircle, Trophy, User } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Add Problem",
    href: "/dashboard?tab=add",
    icon: PlusCircle,
  },
  {
    title: "My Problems",
    href: "/dashboard?tab=list",
    icon: ListTodo,
  },
  {
    title: "Visualizations",
    href: "/visualize",
    icon: BarChart,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Code2,
  },
  {
    title: "Contests",
    href: "/contests",
    icon: Trophy,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  (pathname === item.href || (item.href.includes("?tab=") && pathname === item.href.split("?")[0])) &&
                    "bg-accent text-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
