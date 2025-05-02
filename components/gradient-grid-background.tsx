"use client"

import { useEffect, useRef } from "react"

interface GradientGridBackgroundProps {
  className?: string
}

export function GradientGridBackground({ className = "" }: GradientGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
    }

    // Draw grid
    const drawGrid = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Grid settings
      const cellSize = 50
      const lineWidth = 0.5

      // Calculate grid dimensions
      const cols = Math.ceil(canvas.width / cellSize) + 1
      const rows = Math.ceil(canvas.height / cellSize) + 1

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(255, 161, 22, 0.05)") // LeetCode orange
      gradient.addColorStop(0.5, "rgba(255, 192, 30, 0.03)") // LeetCode yellow
      gradient.addColorStop(1, "rgba(0, 122, 204, 0.05)") // LeetCode blue

      // Draw grid
      ctx.strokeStyle = gradient
      ctx.lineWidth = lineWidth

      // Draw vertical lines
      for (let i = 0; i < cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let i = 0; i < rows; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(canvas.width, i * cellSize)
        ctx.stroke()
      }

      // Add some glowing dots at intersections
      const dotRadius = 1
      const maxDots = 20 // Limit the number of dots for performance
      const dotPositions = []

      // Generate random positions for dots
      for (let i = 0; i < maxDots; i++) {
        const x = Math.floor(Math.random() * cols) * cellSize
        const y = Math.floor(Math.random() * rows) * cellSize
        dotPositions.push({ x, y })
      }

      // Draw dots with glow
      dotPositions.forEach((pos) => {
        // Glow
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, dotRadius * 5)
        glow.addColorStop(0, "rgba(255, 161, 22, 0.8)")
        glow.addColorStop(1, "rgba(255, 161, 22, 0)")

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, dotRadius * 5, 0, Math.PI * 2)
        ctx.fill()

        // Dot
        ctx.fillStyle = "rgba(255, 161, 22, 0.8)"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Initial setup
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Animation loop for subtle movement
    let animationFrame: number
    const animate = () => {
      drawGrid()
      animationFrame = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 opacity-70 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
