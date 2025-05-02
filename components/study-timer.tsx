"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"

export function StudyTimer() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [breakTime, setBreakTime] = useState(5 * 60) // 5 minutes in seconds
  const [cycles, setCycles] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            // Timer completed
            clearInterval(interval as NodeJS.Timeout)

            // Play sound if enabled
            if (soundEnabled) {
              const audio = new Audio("/notification.mp3")
              audio.play().catch((err) => console.error("Error playing sound:", err))
            }

            if (isBreak) {
              // Break finished, start work timer
              setIsBreak(false)
              setCycles((c) => c + 1)
              return initialTime
            } else {
              // Work finished, start break timer
              setIsBreak(true)
              return breakTime
            }
          }
          return time - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused, isBreak, initialTime, breakTime, soundEnabled])

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(false)
    setTime(isBreak ? breakTime : initialTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (time / (isBreak ? breakTime : initialTime)) * 100

  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isBreak ? "Break Time" : "Focus Time"}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{formatTime(time)}</div>
          <div className="text-sm text-muted-foreground">
            {isBreak ? "Relax and recharge" : "Stay focused and productive"}
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="work-time">Work: {Math.floor(initialTime / 60)} min</Label>
            </div>
            <Slider
              id="work-time"
              min={5}
              max={60}
              step={5}
              defaultValue={[25]}
              disabled={isActive}
              onValueChange={(value) => {
                setInitialTime(value[0] * 60)
                if (!isActive || (isActive && !isBreak)) {
                  setTime(value[0] * 60)
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-time">Break: {Math.floor(breakTime / 60)} min</Label>
            </div>
            <Slider
              id="break-time"
              min={1}
              max={15}
              step={1}
              defaultValue={[5]}
              disabled={isActive}
              onValueChange={(value) => {
                setBreakTime(value[0] * 60)
                if (isActive && isBreak) {
                  setTime(value[0] * 60)
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="auto-start" />
            <Label htmlFor="auto-start">Auto-start breaks</Label>
          </div>
          <div className="text-sm text-muted-foreground">Cycles: {cycles}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon" onClick={handleReset} className="neu-button rounded-full">
          <RotateCcw className="h-4 w-4" />
        </Button>
        {isActive && !isPaused ? (
          <Button onClick={handlePause} className="gradient-button px-8">
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
        ) : isActive && isPaused ? (
          <Button onClick={handleResume} className="gradient-button px-8">
            <Play className="mr-2 h-4 w-4" /> Resume
          </Button>
        ) : (
          <Button onClick={handleStart} className="gradient-button px-8">
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
