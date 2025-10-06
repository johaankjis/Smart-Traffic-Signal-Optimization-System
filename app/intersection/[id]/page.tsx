"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignalStatusGrid } from "@/components/signal-status-grid"
import { TrafficFlowChart } from "@/components/traffic-flow-chart"
import { BulkOverridePanel } from "@/components/bulk-override-panel"
import { ArrowLeft, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function IntersectionDetailPage({ params }: { params: { id: string } }) {
  const { data, error, mutate } = useSWR(`/api/intersections/${params.id}`, fetcher, {
    refreshInterval: 3000,
  })
  const { data: historyData } = useSWR(`/api/intersections/${params.id}/traffic?limit=50`, fetcher, {
    refreshInterval: 5000,
  })
  const [optimizing, setOptimizing] = useState(false)

  const handleOptimize = async (autoApply: boolean) => {
    setOptimizing(true)
    try {
      await fetch(`/api/intersections/${params.id}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoApply }),
      })
      mutate()
    } catch (error) {
      console.error("[v0] Optimization error:", error)
    } finally {
      setOptimizing(false)
    }
  }

  if (error) return <div className="p-6 text-destructive">Failed to load intersection</div>
  if (!data) return <div className="p-6 text-muted-foreground">Loading intersection...</div>

  const { intersection, trafficData, optimizationResult } = data

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-balance">{intersection.name}</h1>
              <p className="text-muted-foreground mt-1">
                {intersection.location.latitude.toFixed(4)}, {intersection.location.longitude.toFixed(4)}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {intersection.id}
          </Badge>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => handleOptimize(false)} disabled={optimizing}>
            <Zap className="mr-2 h-4 w-4" />
            Calculate Optimization
          </Button>
          <Button onClick={() => handleOptimize(true)} disabled={optimizing} variant="secondary">
            <TrendingUp className="mr-2 h-4 w-4" />
            Optimize & Apply
          </Button>
        </div>

        {optimizationResult && (
          <Card className="p-6 border-primary">
            <h3 className="text-lg font-semibold mb-4">Latest Optimization Result</h3>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Expected Improvement</p>
                <p className="text-2xl font-bold text-success">{optimizationResult.expectedImprovement}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold">{(optimizationResult.confidence * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Algorithm</p>
                <p className="text-2xl font-bold capitalize">{optimizationResult.algorithm}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <p className="text-sm font-medium">Recommended Timings:</p>
              {optimizationResult.recommendations.map((rec: any) => (
                <div key={rec.direction} className="flex items-center justify-between text-sm bg-muted p-3 rounded-md">
                  <span className="capitalize font-medium">{rec.direction}</span>
                  <span className="text-muted-foreground">
                    Green: {rec.greenDuration}s | Yellow: {rec.yellowDuration}s | Red: {rec.redDuration}s
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <BulkOverridePanel signals={intersection.signals} intersectionId={params.id} onUpdate={mutate} />

        <SignalStatusGrid
          signals={intersection.signals}
          trafficData={trafficData}
          intersectionId={params.id}
          onUpdate={mutate}
        />

        {historyData && <TrafficFlowChart data={historyData.trafficData} />}
      </div>
    </div>
  )
}
