// API route to update a specific signal (manual override)
import { NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function PATCH(request: Request, { params }: { params: { id: string; signalId: string } }) {
  try {
    const body = await request.json()

    const updates: any = {
      isManualOverride: true,
    }

    if (body.currentState) updates.currentState = body.currentState
    if (body.greenDuration !== undefined) updates.greenDuration = body.greenDuration
    if (body.yellowDuration !== undefined) updates.yellowDuration = body.yellowDuration
    if (body.redDuration !== undefined) updates.redDuration = body.redDuration

    const success = dataStore.updateSignal(params.id, params.signalId, updates)

    if (!success) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 })
    }

    const intersection = dataStore.getIntersection(params.id)
    const signal = intersection?.signals.find((s) => s.id === params.signalId)

    return NextResponse.json({ signal })
  } catch (error) {
    console.error("[v0] Error updating signal:", error)
    return NextResponse.json({ error: "Failed to update signal" }, { status: 500 })
  }
}
