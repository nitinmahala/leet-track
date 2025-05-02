"use client"

import { useState } from "react"
import { useProblems } from "@/hooks/use-problems"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { GradientGridBackground } from "@/components/gradient-grid-background"

const COMPANY_TAGS = [
  "Amazon",
  "Apple",
  "Bloomberg",
  "Facebook",
  "Google",
  "LinkedIn",
  "Microsoft",
  "Uber",
  "Twitter",
  "Adobe",
  "Airbnb",
  "ByteDance",
  "Cisco",
  "eBay",
  "Expedia",
  "Goldman Sachs",
  "IBM",
  "Intel",
  "Oracle",
  "PayPal",
  "Salesforce",
  "SAP",
  "Snapchat",
  "Spotify",
  "VMware",
  "Walmart",
  "Yahoo",
  "Yelp",
  "Zillow",
]

export default function CompaniesPage() {
  const { problems } = useProblems()
  const [searchQuery, setSearchQuery] = useState("")

  // Generate company stats
  const companyStats = COMPANY_TAGS.map((company) => {
    const companyProblems = problems.filter((p) => p.companyTags && p.companyTags.includes(company))

    const solved = companyProblems.filter((p) => p.status === "Solved").length
    const total = companyProblems.length

    return {
      name: company,
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    }
  }).sort((a, b) => b.total - a.total)

  const filteredCompanies = companyStats.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GradientGridBackground />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Company Tags</h1>
            <p className="text-muted-foreground">
              Track your progress on problems frequently asked by top tech companies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm glass"
            />
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Problems tagged by company based on interview reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Solved</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.name} className="hover:bg-white/5">
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.solved}</TableCell>
                      <TableCell>{company.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 neu-inset rounded-full overflow-hidden">
                            <div
                              className="h-full bg-leetcode-orange rounded-full"
                              style={{ width: `${company.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs">{company.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
