"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { syncLeetCodeProblems } from "@/lib/leetcode-service"
import { Loader2, Save, RefreshCw } from "lucide-react"
import { useUserSettings } from "@/hooks/use-user-settings"
import { GradientGridBackground } from "@/components/gradient-grid-background"

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { settings, loading: settingsLoading, error, updateSettings } = useUserSettings()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  // Add this useEffect at the beginning of the component, after the state declarations
  useEffect(() => {
    // Check if we're offline on component mount
    if (!navigator.onLine) {
      toast({
        title: "Offline Mode",
        description: "You're currently offline. Changes will be saved locally until you reconnect.",
      })
    }
  }, [])

  useEffect(() => {
    if (error && !settingsLoading) {
      // Use a less alarming toast for offline errors
      if (error.includes("offline")) {
        toast({
          title: "Offline Mode",
          description: error,
          // Use default variant instead of destructive for offline errors
        })
      } else {
        toast({
          title: "Notice",
          description: error,
          variant: "destructive",
        })
      }
    }
  }, [error, settingsLoading])

  // Add a retry function to attempt to reconnect
  const handleRetry = async () => {
    if (!navigator.onLine) {
      toast({
        title: "Still offline",
        description: "Your device is still offline. Please check your connection.",
        variant: "destructive",
      })
      return
    }

    setIsRetrying(true)
    try {
      // Force a refresh of the settings
      await updateSettings({})
      toast({
        title: "Connection restored",
        description: "Successfully reconnected to the server.",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to reconnect. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsRetrying(false)
    }
  }

  // Modify the saveSettings function to handle localStorage fallback
  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const result = await updateSettings(settings)

      if (result.success) {
        if (result.warning) {
          // Show a warning toast for offline saves
          toast({
            title: "Settings saved locally",
            description: result.warning,
          })
        } else {
          toast({
            title: "Settings saved",
            description: "Your settings have been saved successfully.",
          })
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)

      // Try to save to localStorage as a last resort
      try {
        localStorage.setItem(`user_settings_${user?.uid}`, JSON.stringify(settings))
        toast({
          title: "Settings saved locally",
          description: "Could not connect to server, but settings were saved to your device.",
        })
      } catch (localError) {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again when online.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleSyncLeetCode = async () => {
    setIsSyncing(true)
    try {
      if (!settings.leetcodeUsername) {
        toast({
          title: "LeetCode Username Required",
          description: "Please enter your LeetCode username before syncing.",
          variant: "destructive",
        })
        return
      }

      await syncLeetCodeProblems(settings.leetcodeUsername)
      toast({
        title: "LeetCode Synced",
        description: "Your LeetCode progress has been synced.",
      })
    } catch (error: any) {
      console.error("LeetCode Sync Error:", error)
      toast({
        title: "Sync Error",
        description: error?.message || "Failed to sync LeetCode progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Add this right after the GradientGridBackground component in the return statement
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <GradientGridBackground />
      {error && (
        <div
          className={`container mx-auto mt-4 ${error.includes("offline") ? "bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400" : "bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400"} px-4 py-3 rounded-md flex items-center justify-between`}
        >
          <div className="flex items-center">
            <div
              className={`mr-2 h-2 w-2 rounded-full ${error.includes("offline") ? "bg-amber-500" : "bg-red-500"} animate-pulse`}
            ></div>
            <p>{error}</p>
          </div>
          {error.includes("offline") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying || !navigator.onLine}
              className="ml-4"
            >
              {isRetrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Retry Connection
            </Button>
          )}
        </div>
      )}
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="glass">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your general application preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => updateSettings({ theme: value as "light" | "dark" | "system" })}
                    >
                      <SelectTrigger className="glass w-full">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyGoal">Daily Goal (problems)</Label>
                    <Input
                      id="dailyGoal"
                      type="number"
                      className="glass"
                      min={1}
                      max={20}
                      value={settings.dailyGoal}
                      onChange={(e) => updateSettings({ dailyGoal: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyGoal">Weekly Goal (problems)</Label>
                    <Input
                      id="weeklyGoal"
                      type="number"
                      className="glass"
                      min={1}
                      max={100}
                      value={settings.weeklyGoal}
                      onChange={(e) => updateSettings({ weeklyGoal: Number.parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings} disabled={isSaving} className="gradient-button hover-lift">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="glass" value={user?.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">To change your email, please contact support.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex gap-2">
                      <Input id="password" type="password" className="glass" value="••••••••••••" disabled />
                      <Button variant="outline" className="glass">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leetcode">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>LeetCode Integration</CardTitle>
                  <CardDescription>Connect your LeetCode account to sync your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="leetcodeUsername">LeetCode Username</Label>
                    <Input
                      id="leetcodeUsername"
                      className="glass"
                      value={settings.leetcodeUsername}
                      onChange={(e) => updateSettings({ leetcodeUsername: e.target.value })}
                      placeholder="Enter your LeetCode username"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoSync"
                      checked={settings.autoSync}
                      onCheckedChange={(checked) => updateSettings({ autoSync: checked })}
                    />
                    <Label htmlFor="autoSync">Auto-sync LeetCode problems daily</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleSyncLeetCode}
                      disabled={isSyncing || !settings.leetcodeUsername}
                      className="gradient-button hover-lift"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>Sync Now</>
                      )}
                    </Button>
                    <Button onClick={saveSettings} disabled={isSaving} variant="outline" className="glass">
                      {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
                    />
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notif-streak" defaultChecked />
                        <Label htmlFor="notif-streak">Streak reminders</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notif-contest" defaultChecked />
                        <Label htmlFor="notif-contest">Contest notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notif-goal" defaultChecked />
                        <Label htmlFor="notif-goal">Goal achievements</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings} disabled={isSaving} className="gradient-button hover-lift">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
