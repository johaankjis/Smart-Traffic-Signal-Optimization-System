// API route to control the traffic simulator
import { NextResponse } from "next/server"
import { trafficSimulator } from "@/lib/traffic-simulator"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body.action

    if (action === "start") {
      trafficSimulator.start()
      return NextResponse.json({ status: "started", ...trafficSimulator.getStatus() })
    } else if (action === "stop") {
      trafficSimulator.stop()
      return NextResponse.json({ status: "stopped", ...trafficSimulator.getStatus() })
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'start' or 'stop'" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error controlling simulator:", error)
    return NextResponse.json({ error: "Failed to control simulator" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const status = trafficSimulator.getStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("[v0] Error getting simulator status:", error)
    return NextResponse.json({ error: "Failed to get simulator status" }, { status: 500 })
  }
}
