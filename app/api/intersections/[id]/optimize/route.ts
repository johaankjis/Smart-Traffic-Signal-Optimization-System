// API route to run optimization for an intersection
import { NextResponse } from "next/server"
import { optimizationEngine } from "@/lib/optimization-engine"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const autoApply = body.autoApply || false

    const result = await optimizationEngine.optimizeIntersection(params.id)

    if (autoApply) {
      await optimizationEngine.applyOptimization(params.id, true)
    }

    return NextResponse.json({
      result,
      applied: autoApply,
    })
  } catch (error) {
    console.error("[v0] Error running optimization:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Optimization failed" }, { status: 500 })
  }
}
