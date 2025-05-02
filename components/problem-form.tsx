"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Problem } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  status: z.enum(["Solved", "Attempted", "To Do"]),
  notes: z.string().optional(),
  dateSolved: z.string().optional(),
  companyTags: z.array(z.string()).optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  contestId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const topics = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Graph",
  "Heap",
  "Bit Manipulation",
  "Stack",
  "Queue",
  "Linked List",
  "Sliding Window",
  "Divide and Conquer",
  "Recursion",
  "Other",
]

const companies = [
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

interface ProblemFormProps {
  initialData?: Problem
  onSubmit: (data: Problem) => void
}

export function ProblemForm({ initialData, onSubmit }: ProblemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(initialData?.companyTags || [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      url: "",
      topic: "",
      difficulty: "Medium",
      status: "Solved",
      notes: "",
      dateSolved: new Date().toISOString().split("T")[0],
      companyTags: [],
      timeComplexity: "",
      spaceComplexity: "",
      contestId: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      onSubmit({
        id: initialData?.id || Date.now().toString(),
        ...values,
        companyTags: selectedCompanies,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      if (!initialData) {
        form.reset({
          title: "",
          url: "",
          topic: "",
          difficulty: "Medium",
          status: "Solved",
          notes: "",
          dateSolved: new Date().toISOString().split("T")[0],
          companyTags: [],
          timeComplexity: "",
          spaceComplexity: "",
          contestId: "",
        })
        setSelectedCompanies([])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) => (prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Title</FormLabel>
                <FormControl>
                  <Input placeholder="Two Sum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LeetCode URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://leetcode.com/problems/two-sum/" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateSolved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Solved</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Solved" />
                    </FormControl>
                    <FormLabel className="font-normal">Solved</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Attempted" />
                    </FormControl>
                    <FormLabel className="font-normal">Attempted</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="To Do" />
                    </FormControl>
                    <FormLabel className="font-normal">To Do</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="timeComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Complexity</FormLabel>
                <FormControl>
                  <Input placeholder="O(n)" {...field} />
                </FormControl>
                <FormDescription>e.g., O(n), O(n log n), O(n²)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spaceComplexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Complexity</FormLabel>
                <FormControl>
                  <Input placeholder="O(n)" {...field} />
                </FormControl>
                <FormDescription>e.g., O(1), O(n), O(n²)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest ID (if applicable)</FormLabel>
              <FormControl>
                <Input placeholder="Weekly Contest 345" {...field} />
              </FormControl>
              <FormDescription>Leave empty if not from a contest</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyTags"
          render={() => (
            <FormItem>
              <FormLabel>Company Tags</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {companies.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={() => toggleCompany(company)}
                    />
                    <label
                      htmlFor={`company-${company}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {company}
                    </label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add your notes about the problem and solution..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can add your approach, time complexity, or any other notes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-leetcode-orange hover:bg-leetcode-orange/90 text-white"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Problem" : "Add Problem"}
        </Button>
      </form>
    </Form>
  )
}
