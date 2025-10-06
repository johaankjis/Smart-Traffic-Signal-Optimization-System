// Optimization engine wrapper - executes Python optimization script
import { spawn } from "child_process"
import type { OptimizationResult } from "./types"
import { dataStore } from "./data-store"

export class OptimizationEngine {
  async optimizeIntersection(intersectionId: string): Promise<OptimizationResult> {
    // Get latest traffic data for the intersection
    const trafficData = dataStore.getLatestTrafficData(intersectionId)

    if (trafficData.length === 0) {
      throw new Error("No traffic data available for optimization")
    }

    // Prepare input for Python script
    const input = {
      intersectionId,
      trafficData: trafficData.map((td) => ({
        direction: td.direction,
        vehicleCount: td.vehicleCount,
        avgSpeed: td.avgSpeed,
        queueLength: td.queueLength,
      })),
    }

    try {
      // Execute Python optimization script
      const result = await this.executePythonScript(input)

      // Create optimization result object
      const optimizationResult: OptimizationResult = {
        id: result.id || `opt-${intersectionId}-${Date.now()}`,
        intersectionId,
        timestamp: new Date(),
        recommendations: result.recommendations || [],
        expectedImprovement: result.expectedImprovement || 0,
        confidence: result.confidence || 0,
        algorithm: result.algorithm || "rule-based",
      }

      // Store the result
      dataStore.addOptimizationResult(optimizationResult)

      return optimizationResult
    } catch (error) {
      console.error("[v0] Optimization error:", error)
      throw new Error(`Optimization failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private executePythonScript(input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn("python3", ["scripts/optimize-signals.py"])

      let outputData = ""
      let errorData = ""

      // Send input to Python script via stdin
      python.stdin.write(JSON.stringify(input))
      python.stdin.end()

      // Collect output
      python.stdout.on("data", (data) => {
        outputData += data.toString()
      })

      python.stderr.on("data", (data) => {
        errorData += data.toString()
      })

      python.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}: ${errorData}`))
          return
        }

        try {
          const result = JSON.parse(outputData)
          if (result.error) {
            reject(new Error(result.error))
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${outputData}`))
        }
      })

      python.on("error", (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`))
      })
    })
  }

  async applyOptimization(intersectionId: string, autoApply = false): Promise<boolean> {
    const result = await this.optimizeIntersection(intersectionId)

    if (!autoApply) {
      return false // Just calculated, didn't apply
    }

    // Apply the recommended timings to signals
    const intersection = dataStore.getIntersection(intersectionId)
    if (!intersection) {
      throw new Error("Intersection not found")
    }

    result.recommendations.forEach((recommendation) => {
      const signal = intersection.signals.find((s) => s.direction === recommendation.direction)
      if (signal) {
        dataStore.updateSignal(intersectionId, signal.id, {
          greenDuration: recommendation.greenDuration,
          yellowDuration: recommendation.yellowDuration,
          redDuration: recommendation.redDuration,
          isManualOverride: false,
        })
      }
    })

    return true
  }
}

// Singleton instance
export const optimizationEngine = new OptimizationEngine()
