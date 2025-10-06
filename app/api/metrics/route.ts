// API route to get system-wide metrics
import { NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { SystemMetrics } from "@/lib/types"

export async function GET() {
  try {
    const intersections = dataStore.getAllIntersections()
    const totalIntersections = intersections.length
    const activeSignals = intersections.reduce((sum, int) => sum + int.signals.length, 0)

    // Calculate average wait time across all intersections
    let totalWaitTime = 0
    const congestionCount = { low: 0, medium: 0, high: 0 }

    intersections.forEach((intersection) => {
      const trafficData = dataStore.getLatestTrafficData(intersection.id)
      const avgQueue = trafficData.reduce((sum, td) => sum + td.queueLength, 0) / trafficData.length
      totalWaitTime += avgQueue * 2 // Estimate 2 seconds per vehicle in queue

      // Determine congestion level
      if (avgQueue < 5) congestionCount.low++
      else if (avgQueue < 10) congestionCount.medium++
      else congestionCount.high++
    })

    const avgWaitTime = totalIntersections > 0 ? totalWaitTime / totalIntersections : 0
    const congestionLevel =
      congestionCount.high > totalIntersections / 2
        ? "high"
        : congestionCount.medium > totalIntersections / 2
          ? "medium"
          : "low"

    const metrics: SystemMetrics = {
      totalIntersections,
      activeSignals,
      avgWaitTime: Math.round(avgWaitTime),
      congestionLevel,
      optimizationRate: 0.85, // Placeholder - would track actual optimization success rate
      timestamp: new Date(),
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
