"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import type { TrafficSignal } from "@/lib/types"

interface BulkOverridePanelProps {
  signals: TrafficSignal[]
  intersectionId: string
  onUpdate: () => void
}

export function BulkOverridePanel({ signals, intersectionId, onUpdate }: BulkOverridePanelProps) {
  const [loading, setLoading] = useState(false)
  const [greenDuration, setGreenDuration] = useState(30)
  const [success, setSuccess] = useState(false)

  const handleBulkUpdate = async () => {
    setLoading(true)
    setSuccess(false)
    try {
      await Promise.all(
        signals.map((signal) =>
          fetch(`/api/intersections/${intersectionId}/signals/${signal.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              greenDuration,
              yellowDuration: 3,
              redDuration: 120 - greenDuration - 3,
            }),
          }),
        ),
      )
      setSuccess(true)
      onUpdate()
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Bulk update error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold">Bulk Signal Override</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Apply the same timing to all signals at this intersection
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="bulk-green">Green Duration (seconds)</Label>
          <Input
            id="bulk-green"
            type="number"
            min="10"
            max="60"
            value={greenDuration}
            onChange={(e) => setGreenDuration(Number.parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Yellow: 3s | Red: {120 - greenDuration - 3}s (Total cycle: 120s)
          </p>
        </div>

        <Button onClick={handleBulkUpdate} disabled={loading} className="w-full">
          {success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Applied Successfully
            </>
          ) : (
            "Apply to All Signals"
          )}
        </Button>
      </div>
    </Card>
  )
}
