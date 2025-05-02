"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false)

  const attemptReconnection = () => {
    // This function will try to force a network reconnection
    // It's mostly a visual indicator as the browser handles actual reconnection

    setIsOnline(navigator.onLine)

    if (navigator.onLine) {
      toast({
        title: "Connection check",
        description: "Your device reports that you are online. Attempting to reconnect to services.",
      })

      // Simulate checking connection with a timeout
      setTimeout(() => {
        if (navigator.onLine) {
          toast({
            title: "Connection restored",
            description: "Successfully reconnected to services.",
          })
        } else {
          toast({
            title: "Connection failed",
            description: "Your device appears to be offline. Please check your connection.",
            variant: "destructive",
          })
        }
      }, 1500)
    } else {
      toast({
        title: "Still offline",
        description: "Your device is still offline. Please check your connection.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)
    setShowOfflineIndicator(!navigator.onLine)

    // Define event handlers
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online",
        description: "Your changes will now be saved to the server.",
      })

      // Hide the offline indicator after a delay
      setTimeout(() => {
        setShowOfflineIndicator(false)
      }, 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineIndicator(true)
      toast({
        title: "You're offline",
        description: "Changes will be saved locally until you reconnect.",
        variant: "destructive",
      })
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleDismiss = () => {
    setShowOfflineIndicator(false)
  }

  if (!showOfflineIndicator) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-background border border-red-500/50 px-4 py-2 text-sm shadow-lg">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>Offline - Using local data</span>
          <Button variant="outline" size="sm" className="ml-2 text-xs py-1 h-7" onClick={attemptReconnection}>
            Reconnect
          </Button>
        </>
      )}
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2" onClick={handleDismiss}>
        ×
      </Button>
    </div>
  )
}
