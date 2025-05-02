"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore"
import { useEffect } from "react"
import type { Contest } from "@/lib/types"
import { GradientGridBackground } from "@/components/gradient-grid-background"
import { db } from "@/lib/firebase"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  rank: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : undefined)),
  score: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : undefined)),
  problemsSolved: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : undefined)),
  totalProblems: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val) : undefined)),
  notes: z.string().optional(),
})

export default function ContestsPage() {
  const { user } = useAuth()
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      rank: "",
      score: "",
      problemsSolved: "",
      totalProblems: "",
      notes: "",
    },
  })

  // Fetch contests
  useEffect(() => {
    if (!user) {
      setContests([])
      setLoading(false)
      return
    }

    const fetchContests = async () => {
      try {
        const contestsQuery = query(
          collection(db, "contests"),
          where("userId", "==", user.uid),
          orderBy("date", "desc"),
        )

        const snapshot = await getDocs(contestsQuery)
        const contestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Contest[]

        setContests(contestsData)
      } catch (error) {
        console.error("Error fetching contests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [user])

  // Add contest
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return

    try {
      await addDoc(collection(db, "contests"), {
        ...values,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      setIsDialogOpen(false)
      form.reset()

      // Refresh contests
      const contestsQuery = query(collection(db, "contests"), where("userId", "==", user.uid), orderBy("date", "desc"))

      const snapshot = await getDocs(contestsQuery)
      const contestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contest[]

      setContests(contestsData)
    } catch (error) {
      console.error("Error adding contest:", error)
    }
  }

  // Prepare chart data
  const chartData = contests
    .filter((contest) => contest.rank)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((contest) => ({
      name: contest.title,
      date: new Date(contest.date).toLocaleDateString(),
      rank: contest.rank,
    }))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GradientGridBackground />
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Contest Tracking</h1>
              <p className="text-muted-foreground">Track your performance in LeetCode contests</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-button hover-lift">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Contest
                </Button>
              </DialogTrigger>
              <DialogContent className="glass sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add Contest</DialogTitle>
                  <DialogDescription>Record your participation in a LeetCode contest</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contest Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Weekly Contest 345" {...field} className="glass" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="glass" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rank</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1234" {...field} className="glass" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="score"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Score</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="12" {...field} className="glass" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="problemsSolved"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Problems Solved</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="3" {...field} className="glass" />
                            </FormControl>
                            <FormMessage\
