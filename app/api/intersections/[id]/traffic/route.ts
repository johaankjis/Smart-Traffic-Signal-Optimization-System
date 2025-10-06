// API route to get traffic data history for an intersection
import { NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const trafficData = dataStore.getTrafficData(params.id, limit)

    return NextResponse.json({ trafficData })
  } catch (error) {
    console.error("[v0] Error fetching traffic data:", error)
    return NextResponse.json({ error: "Failed to fetch traffic data" }, { status: 500 })
  }
}
