// Core data models for the traffic signal optimization system

export interface Intersection {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
  }
  signals: TrafficSignal[]
  createdAt: Date
  updatedAt: Date
}

export interface TrafficSignal {
  id: string
  intersectionId: string
  direction: "north" | "south" | "east" | "west"
  currentState: "red" | "yellow" | "green"
  greenDuration: number // seconds
  yellowDuration: number // seconds
  redDuration: number // seconds
  lastStateChange: Date
  isManualOverride: boolean
}

export interface TrafficData {
  id: string
  intersectionId: string
  direction: "north" | "south" | "east" | "west"
  vehicleCount: number
  avgSpeed: number // km/h
  timestamp: Date
  queueLength: number // estimated vehicles waiting
}

export interface OptimizationResult {
  id: string
  intersectionId: string
  timestamp: Date
  recommendations: SignalTiming[]
  expectedImprovement: number // percentage
  confidence: number // 0-1
  algorithm: "rule-based" | "ml-optimized"
}

export interface SignalTiming {
  direction: "north" | "south" | "east" | "west"
  greenDuration: number
  yellowDuration: number
  redDuration: number
  priority: number
}

export interface SystemMetrics {
  totalIntersections: number
  activeSignals: number
  avgWaitTime: number
  congestionLevel: "low" | "medium" | "high"
  optimizationRate: number
  timestamp: Date
}
