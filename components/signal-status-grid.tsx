"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TrafficSignal, TrafficData } from "@/lib/types"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { SignalControlDialog } from "./signal-control-dialog"

interface SignalStatusGridProps {
  signals: TrafficSignal[]
  trafficData: TrafficData[]
  intersectionId?: string
  onUpdate?: () => void
}

export function SignalStatusGrid({ signals, trafficData, intersectionId, onUpdate }: SignalStatusGridProps) {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "north":
        return <ArrowUp className="h-6 w-6" />
      case "south":
        return <ArrowDown className="h-6 w-6" />
      case "east":
        return <ArrowRight className="h-6 w-6" />
      case "west":
        return <ArrowLeft className="h-6 w-6" />
      default:
        return null
    }
  }

  const getSignalColor = (state: TrafficSignal["currentState"]) => {
    switch (state) {
      case "green":
        return "bg-success"
      case "yellow":
        return "bg-warning"
      case "red":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {signals.map((signal) => {
        const traffic = trafficData.find((td) => td.direction === signal.direction)

        return (
          <Card key={signal.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getDirectionIcon(signal.direction)}
                <div>
                  <h4 className="font-semibold capitalize">{signal.direction}</h4>
                  <p className="text-xs text-muted-foreground">{signal.id}</p>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${getSignalColor(signal.currentState)}`} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Green Duration:</span>
                <span className="font-medium">{signal.greenDuration}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vehicle Count:</span>
                <span className="font-medium">{traffic?.vehicleCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Queue Length:</span>
                <span className="font-medium">{traffic?.queueLength || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Speed:</span>
                <span className="font-medium">{traffic?.avgSpeed || 0} km/h</span>
              </div>
              {signal.isManualOverride && (
                <Badge variant="destructive" className="w-full justify-center">
                  Manual Override
                </Badge>
              )}
              {intersectionId && onUpdate && (
                <SignalControlDialog signal={signal} intersectionId={intersectionId} onUpdate={onUpdate} />
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
