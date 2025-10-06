"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import type { Intersection, TrafficSignal } from "@/lib/types"
import Link from "next/link"

interface IntersectionCardProps {
  intersection: Intersection
}

export function IntersectionCard({ intersection }: IntersectionCardProps) {
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
    <Card className="p-6 hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-balance">{intersection.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {intersection.location.latitude.toFixed(4)}, {intersection.location.longitude.toFixed(4)}
            </span>
          </div>
        </div>
        <Badge variant="secondary">{intersection.id}</Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {intersection.signals.map((signal) => (
          <div key={signal.id} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full ${getSignalColor(signal.currentState)}`} />
            <span className="text-xs text-muted-foreground uppercase">{signal.direction.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      <Link href={`/intersection/${intersection.id}`}>
        <Button className="w-full bg-transparent" variant="outline">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </Card>
  )
}
