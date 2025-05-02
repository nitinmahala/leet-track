"use client"

import { useEffect, useState } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { useAuth } from "@/context/auth-context"
import type { Problem } from "@/lib/types"
import { db } from "@/lib/firebase"

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setProblems([])
      setLoading(false)
      return
    }

    const problemsQuery = query(collection(db, "problems"), where("userId", "==", user.uid))

    const unsubscribe = onSnapshot(
      problemsQuery,
      (snapshot) => {
        const problemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Problem[]

        setProblems(problemsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching problems:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const addProblem = async (problem: Problem) => {
    if (!user) return

    try {
      await addDoc(collection(db, "problems"), {
        ...problem,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error adding problem:", error)
      throw error
    }
  }

  const updateProblem = async (problem: Problem) => {
    if (!user) return

    try {
      const { id, ...problemData } = problem
      await updateDoc(doc(db, "problems", id), {
        ...problemData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating problem:", error)
      throw error
    }
  }

  const deleteProblem = async (id: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, "problems", id))
    } catch (error) {
      console.error("Error deleting problem:", error)
      throw error
    }
  }

  return {
    problems,
    loading,
    addProblem,
    updateProblem,
    deleteProblem,
  }
}
