// API route to get a specific intersection with latest traffic data
import { NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const intersection = dataStore.getIntersection(params.id)

    if (!intersection) {
      return NextResponse.json({ error: "Intersection not found" }, { status: 404 })
    }

    const trafficData = dataStore.getLatestTrafficData(params.id)
    const optimizationResult = dataStore.getLatestOptimizationResult(params.id)

    return NextResponse.json({
      intersection,
      trafficData,
      optimizationResult,
    })
  } catch (error) {
    console.error("[v0] Error fetching intersection:", error)
    return NextResponse.json({ error: "Failed to fetch intersection" }, { status: 500 })
  }
}
