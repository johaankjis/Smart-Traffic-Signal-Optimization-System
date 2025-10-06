// API route to get all intersections
import { NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET() {
  try {
    const intersections = dataStore.getAllIntersections()
    return NextResponse.json({ intersections })
  } catch (error) {
    console.error("[v0] Error fetching intersections:", error)
    return NextResponse.json({ error: "Failed to fetch intersections" }, { status: 500 })
  }
}
