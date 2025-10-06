// In-memory data store for traffic signal system
import type { Intersection, TrafficSignal, TrafficData, OptimizationResult } from "./types"

class DataStore {
  private intersections: Map<string, Intersection> = new Map()
  private trafficData: Map<string, TrafficData[]> = new Map()
  private optimizationResults: Map<string, OptimizationResult[]> = new Map()

  constructor() {
    this.initializeIntersections()
  }

  private initializeIntersections() {
    // Initialize 4 sample intersections
    const intersections: Intersection[] = [
      {
        id: "int-001",
        name: "Main St & 1st Ave",
        location: { latitude: 40.7128, longitude: -74.006 },
        signals: this.createSignalsForIntersection("int-001"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "int-002",
        name: "Broadway & 5th Ave",
        location: { latitude: 40.7589, longitude: -73.9851 },
        signals: this.createSignalsForIntersection("int-002"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "int-003",
        name: "Park Ave & 42nd St",
        location: { latitude: 40.7516, longitude: -73.9755 },
        signals: this.createSignalsForIntersection("int-003"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "int-004",
        name: "Madison Ave & 23rd St",
        location: { latitude: 40.7424, longitude: -73.9882 },
        signals: this.createSignalsForIntersection("int-004"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    intersections.forEach((intersection) => {
      this.intersections.set(intersection.id, intersection)
      this.trafficData.set(intersection.id, [])
      this.optimizationResults.set(intersection.id, [])
    })
  }

  private createSignalsForIntersection(intersectionId: string): TrafficSignal[] {
    const directions: Array<"north" | "south" | "east" | "west"> = ["north", "south", "east", "west"]
    return directions.map((direction, index) => ({
      id: `${intersectionId}-signal-${direction}`,
      intersectionId,
      direction,
      currentState: index === 0 ? "green" : "red",
      greenDuration: 30,
      yellowDuration: 3,
      redDuration: 60,
      lastStateChange: new Date(),
      isManualOverride: false,
    }))
  }

  // Intersection operations
  getAllIntersections(): Intersection[] {
    return Array.from(this.intersections.values())
  }

  getIntersection(id: string): Intersection | undefined {
    return this.intersections.get(id)
  }

  updateSignal(intersectionId: string, signalId: string, updates: Partial<TrafficSignal>): boolean {
    const intersection = this.intersections.get(intersectionId)
    if (!intersection) return false

    const signalIndex = intersection.signals.findIndex((s) => s.id === signalId)
    if (signalIndex === -1) return false

    intersection.signals[signalIndex] = {
      ...intersection.signals[signalIndex],
      ...updates,
      lastStateChange: new Date(),
    }
    intersection.updatedAt = new Date()
    return true
  }

  // Traffic data operations
  addTrafficData(data: TrafficData): void {
    const dataArray = this.trafficData.get(data.intersectionId) || []
    dataArray.push(data)

    // Keep only last 1000 records per intersection
    if (dataArray.length > 1000) {
      dataArray.shift()
    }

    this.trafficData.set(data.intersectionId, dataArray)
  }

  getTrafficData(intersectionId: string, limit = 100): TrafficData[] {
    const data = this.trafficData.get(intersectionId) || []
    return data.slice(-limit)
  }

  getLatestTrafficData(intersectionId: string): TrafficData[] {
    const data = this.trafficData.get(intersectionId) || []
    const directions: Array<"north" | "south" | "east" | "west"> = ["north", "south", "east", "west"]

    return directions.map((direction) => {
      const directionData = data.filter((d) => d.direction === direction)
      return (
        directionData[directionData.length - 1] || {
          id: `temp-${Date.now()}-${direction}`,
          intersectionId,
          direction,
          vehicleCount: 0,
          avgSpeed: 0,
          timestamp: new Date(),
          queueLength: 0,
        }
      )
    })
  }

  // Optimization results operations
  addOptimizationResult(result: OptimizationResult): void {
    const results = this.optimizationResults.get(result.intersectionId) || []
    results.push(result)

    // Keep only last 100 results per intersection
    if (results.length > 100) {
      results.shift()
    }

    this.optimizationResults.set(result.intersectionId, results)
  }

  getOptimizationResults(intersectionId: string, limit = 10): OptimizationResult[] {
    const results = this.optimizationResults.get(intersectionId) || []
    return results.slice(-limit)
  }

  getLatestOptimizationResult(intersectionId: string): OptimizationResult | undefined {
    const results = this.optimizationResults.get(intersectionId) || []
    return results[results.length - 1]
  }
}

// Singleton instance
export const dataStore = new DataStore()
