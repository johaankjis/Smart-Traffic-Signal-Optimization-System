"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { TrafficData } from "@/lib/types"

interface TrafficFlowChartProps {
  data: TrafficData[]
}

export function TrafficFlowChart({ data }: TrafficFlowChartProps) {
  // Group data by direction and prepare for chart
  const chartData = data.reduce((acc, item) => {
    const time = new Date(item.timestamp).toLocaleTimeString()
    const existing = acc.find((d) => d.time === time)

    if (existing) {
      existing[item.direction] = item.vehicleCount
    } else {
      acc.push({
        time,
        [item.direction]: item.vehicleCount,
      })
    }

    return acc
  }, [] as any[])

  // Keep only last 20 data points
  const recentData = chartData.slice(-20)

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Traffic Flow History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={recentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#131824",
              border: "1px solid #1e293b",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="north" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="south" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="east" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="west" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
