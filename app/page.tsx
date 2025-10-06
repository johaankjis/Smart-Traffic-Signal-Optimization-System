"use client"

import { SystemMetrics } from "@/components/system-metrics"
import { IntersectionCard } from "@/components/intersection-card"
import { SimulatorControl } from "@/components/simulator-control"
import useSWR from "swr"
import { useEffect } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const { data, error } = useSWR("/api/intersections", fetcher, {
    refreshInterval: 3000,
  })

  // Auto-start simulator on mount
  useEffect(() => {
    fetch("/api/simulator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    }).catch((err) => console.error("[v0] Failed to start simulator:", err))
  }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-balance">Smart Traffic Signal System</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Real-time traffic optimization and monitoring dashboard
          </p>
        </div>

        <SimulatorControl />

        <SystemMetrics />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Intersections</h2>
          {error && <div className="text-destructive">Failed to load intersections</div>}
          {!data && <div className="text-muted-foreground">Loading intersections...</div>}
          {data && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.intersections.map((intersection: any) => (
                <IntersectionCard key={intersection.id} intersection={intersection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
