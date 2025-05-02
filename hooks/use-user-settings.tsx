"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface UserSettings {
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  dailyGoal: number
  weeklyGoal: number
  leetcodeUsername: string
  autoSync: boolean
}

const defaultSettings: UserSettings = {
  theme: "system",
  emailNotifications: false,
  dailyGoal: 1,
  weeklyGoal: 5,
  leetcodeUsername: "",
  autoSync: false,
}

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    setLoading(true)
    setError(null)

    // First check if we're online
    if (!navigator.onLine) {
      console.log("Device is offline, using local storage or default settings")

      // Try to get settings from localStorage
      try {
        const localSettings = localStorage.getItem(`user_settings_${user.uid}`)
        if (localSettings) {
          const parsedSettings = JSON.parse(localSettings)
          setSettings(parsedSettings)
          console.log("Retrieved settings from localStorage")
        } else {
          console.log("No settings in localStorage, using defaults")
        }
      } catch (err) {
        console.error("Error accessing localStorage:", err)
      }

      setError("You are currently offline. Using locally stored settings until connection is restored.")
      setLoading(false)
      return
    }

    // We're online, try to fetch from Firestore
    try {
      const settingsRef = doc(db, "userSettings", user.uid)
      const settingsDoc = await getDoc(settingsRef)

      if (settingsDoc.exists()) {
        const fetchedSettings = settingsDoc.data() as UserSettings
        setSettings(fetchedSettings)

        // Save to localStorage as backup
        try {
          localStorage.setItem(`user_settings_${user.uid}`, JSON.stringify(fetchedSettings))
        } catch (err) {
          console.error("Error saving to localStorage:", err)
        }
      } else {
        // No settings document exists yet, create default settings
        try {
          await setDoc(doc(db, "userSettings", user.uid), defaultSettings)

          // Save defaults to localStorage
          try {
            localStorage.setItem(`user_settings_${user.uid}`, JSON.stringify(defaultSettings))
          } catch (err) {
            console.error("Error saving defaults to localStorage:", err)
          }
        } catch (createErr) {
          console.error("Error creating default settings:", createErr)
          // Continue with default settings even if we can't save them
        }
      }
    } catch (err: any) {
      console.error("Error fetching settings:", err)

      // Try to get settings from localStorage as fallback
      try {
        const localSettings = localStorage.getItem(`user_settings_${user.uid}`)
        if (localSettings) {
          const parsedSettings = JSON.parse(localSettings)
          setSettings(parsedSettings)
          console.log("Fallback to localStorage after Firestore error")
        }
      } catch (localErr) {
        console.error("Error accessing localStorage:", localErr)
      }

      // Set appropriate error message
      if (err.message?.includes("offline") || !navigator.onLine) {
        setError("You are currently offline. Using locally stored settings until connection is restored.")
      } else {
        setError("Failed to load settings from server. Using locally stored settings.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setSettings(defaultSettings)
      setLoading(false)
      return
    }

    fetchSettings()

    // Add an online/offline event listener to update when connection status changes
    const handleOnline = () => {
      setError(null)
      fetchSettings()
    }

    const handleOffline = () => {
      setError("You are currently offline. Using default settings until connection is restored.")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [user])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return { success: false, error: "Not authenticated" }

    try {
      // Update local state immediately for better UX
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      // Always save to localStorage regardless of online status
      try {
        localStorage.setItem(`user_settings_${user.uid}`, JSON.stringify(updatedSettings))
      } catch (err) {
        console.error("Error saving to localStorage:", err)
      }

      // Check if we're online before attempting to update Firestore
      if (!navigator.onLine) {
        return {
          success: true,
          warning: "You are offline. Changes saved locally and will sync when you reconnect.",
          offline: true,
        }
      }

      // Try to update Firestore
      try {
        await updateDoc(doc(db, "userSettings", user.uid), newSettings)
        return { success: true }
      } catch (err) {
        console.error("Error updating settings in Firestore:", err)
        return {
          success: true,
          warning: "Failed to save settings to the server. Changes are saved locally.",
          offline: true,
        }
      }
    } catch (err) {
      console.error("Error in updateSettings:", err)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
  }
}
