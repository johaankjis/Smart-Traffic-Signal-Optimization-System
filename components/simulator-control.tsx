"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RefreshCw } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SimulatorControl() {
  const { data, mutate } = useSWR("/api/simulator", fetcher, {
    refreshInterval: 2000,
  })
  const [loading, setLoading] = useState(false)

  const handleControl = async (action: "start" | "stop") => {
    setLoading(true)
    try {
      await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      mutate()
    } catch (error) {
      console.error("[v0] Simulator control error:", error)
    } finally {
      setLoading(false)
    }
  }

  const isRunning = data?.isRunning || false

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Traffic Simulator</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Status:{" "}
            <span className={isRunning ? "text-success" : "text-muted-foreground"}>
              {isRunning ? "Running" : "Stopped"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button onClick={() => handleControl("stop")} disabled={loading} variant="destructive">
              <Pause className="mr-2 h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button onClick={() => handleControl("start")} disabled={loading}>
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          )}
          <Button onClick={() => mutate()} disabled={loading} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
