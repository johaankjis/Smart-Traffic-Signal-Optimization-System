"use client"

import { Card } from "@/components/ui/card"
import { Activity, Clock, TrendingDown, TrendingUp } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SystemMetrics() {
  const { data, error } = useSWR("/api/metrics", fetcher, {
    refreshInterval: 3000,
  })

  if (error) return <div className="text-destructive">Failed to load metrics</div>
  if (!data) return <div className="text-muted-foreground">Loading metrics...</div>

  const metrics = data.metrics

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Intersections</p>
            <p className="text-3xl font-bold">{metrics.totalIntersections}</p>
          </div>
          <Activity className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Signals</p>
            <p className="text-3xl font-bold">{metrics.activeSignals}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-success" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg Wait Time</p>
            <p className="text-3xl font-bold">{metrics.avgWaitTime}s</p>
          </div>
          <Clock className="h-8 w-8 text-accent" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Congestion Level</p>
            <p className="text-3xl font-bold capitalize">{metrics.congestionLevel}</p>
          </div>
          <TrendingDown
            className={`h-8 w-8 ${
              metrics.congestionLevel === "high"
                ? "text-destructive"
                : metrics.congestionLevel === "medium"
                  ? "text-warning"
                  : "text-success"
            }`}
          />
        </div>
      </Card>
    </div>
  )
}
