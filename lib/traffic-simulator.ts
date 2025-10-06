// Traffic simulation engine that generates realistic vehicle counts
import type { TrafficData } from "./types"
import { dataStore } from "./data-store"

class TrafficSimulator {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  private simulationSpeed = 2000 // ms between updates

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.generateTrafficData()
    }, this.simulationSpeed)

    console.log("[v0] Traffic simulator started")
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log("[v0] Traffic simulator stopped")
  }

  private generateTrafficData() {
    const intersections = dataStore.getAllIntersections()
    const now = new Date()
    const hour = now.getHours()

    intersections.forEach((intersection) => {
      const directions: Array<"north" | "south" | "east" | "west"> = ["north", "south", "east", "west"]

      directions.forEach((direction) => {
        // Generate realistic traffic patterns based on time of day
        const baseTraffic = this.getBaseTrafficForTime(hour)
        const variance = Math.random() * 0.4 - 0.2 // ±20% variance
        const vehicleCount = Math.max(0, Math.floor(baseTraffic * (1 + variance)))

        // Calculate queue length based on signal state
        const signal = intersection.signals.find((s) => s.direction === direction)
        const queueMultiplier = signal?.currentState === "red" ? 1.5 : 0.3
        const queueLength = Math.floor(vehicleCount * queueMultiplier * Math.random())

        // Calculate average speed (lower when congested)
        const congestionFactor = Math.min(vehicleCount / 50, 1)
        const avgSpeed = Math.floor(50 - congestionFactor * 30) // 20-50 km/h

        const trafficData: TrafficData = {
          id: `traffic-${intersection.id}-${direction}-${Date.now()}`,
          intersectionId: intersection.id,
          direction,
          vehicleCount,
          avgSpeed,
          timestamp: now,
          queueLength,
        }

        dataStore.addTrafficData(trafficData)
      })
    })
  }

  private getBaseTrafficForTime(hour: number): number {
    // Simulate realistic traffic patterns throughout the day
    if (hour >= 7 && hour <= 9) return 45 // Morning rush
    if (hour >= 17 && hour <= 19) return 50 // Evening rush
    if (hour >= 12 && hour <= 14) return 35 // Lunch time
    if (hour >= 22 || hour <= 5) return 8 // Night time
    return 25 // Regular daytime traffic
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      simulationSpeed: this.simulationSpeed,
    }
  }
}

// Singleton instance
export const trafficSimulator = new TrafficSimulator()
