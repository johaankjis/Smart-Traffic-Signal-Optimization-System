"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"
import { useState } from "react"
import type { TrafficSignal } from "@/lib/types"

interface SignalControlDialogProps {
  signal: TrafficSignal
  intersectionId: string
  onUpdate: () => void
}

export function SignalControlDialog({ signal, intersectionId, onUpdate }: SignalControlDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentState, setCurrentState] = useState(signal.currentState)
  const [greenDuration, setGreenDuration] = useState(signal.greenDuration)
  const [yellowDuration, setYellowDuration] = useState(signal.yellowDuration)
  const [redDuration, setRedDuration] = useState(signal.redDuration)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch(`/api/intersections/${intersectionId}/signals/${signal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentState,
          greenDuration,
          yellowDuration,
          redDuration,
        }),
      })
      onUpdate()
      setOpen(false)
    } catch (error) {
      console.error("[v0] Signal update error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Override
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manual Signal Override</DialogTitle>
          <DialogDescription>
            Manually control the signal for {signal.direction} direction. Changes will be marked as manual override.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="state">Current State</Label>
            <Select value={currentState} onValueChange={(value: any) => setCurrentState(value)}>
              <SelectTrigger id="state">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="green">Green Duration (seconds)</Label>
            <Input
              id="green"
              type="number"
              min="10"
              max="60"
              value={greenDuration}
              onChange={(e) => setGreenDuration(Number.parseInt(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yellow">Yellow Duration (seconds)</Label>
            <Input
              id="yellow"
              type="number"
              min="2"
              max="5"
              value={yellowDuration}
              onChange={(e) => setYellowDuration(Number.parseInt(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="red">Red Duration (seconds)</Label>
            <Input
              id="red"
              type="number"
              min="20"
              max="90"
              value={redDuration}
              onChange={(e) => setRedDuration(Number.parseInt(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Apply Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
