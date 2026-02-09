'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'

// Mock data for January 2026 (complete month)
const januaryData = [
  { day: 1, january: 4 },
  { day: 2, january: 3 },
  { day: 3, january: 6 },
  { day: 4, january: 2 },
  { day: 5, january: 8 },
  { day: 6, january: 5 },
  { day: 7, january: 7 },
  { day: 8, january: 3 },
  { day: 9, january: 4 },
  { day: 10, january: 9 },
  { day: 11, january: 6 },
  { day: 12, january: 2 },
  { day: 13, january: 8 },
  { day: 14, january: 5 },
  { day: 15, january: 7 },
  { day: 16, january: 4 },
  { day: 17, january: 10 },
  { day: 18, january: 6 },
  { day: 19, january: 3 },
  { day: 20, january: 8 },
  { day: 21, january: 5 },
  { day: 22, january: 7 },
  { day: 23, january: 4 },
  { day: 24, january: 12 },
  { day: 25, january: 9 },
  { day: 26, january: 6 },
  { day: 27, january: 8 },
  { day: 28, january: 5 },
  { day: 29, january: 7 },
  { day: 30, january: 4 },
  { day: 31, january: 11 },
]

// Mock data for February 2026 (partial month up to day 9)
const februaryData = [
  { day: 1, february: 5 },
  { day: 2, february: 3 },
  { day: 3, february: 7 },
  { day: 4, february: 4 },
  { day: 5, february: 6 },
  { day: 6, february: 8 },
  { day: 7, february: 2 },
  { day: 8, february: 9 },
  { day: 9, february: 5 },
]

// Combine data for the chart, filling in null values for future February days
const combinedData = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  const januaryEntry = januaryData.find(d => d.day === day)
  const februaryEntry = februaryData.find(d => d.day === day)
  
  return {
    day,
    january: januaryEntry?.january || 0,
    february: day <= 9 ? (februaryEntry?.february || 0) : null,
  }
})

// Calculate statistics
const januaryStats = {
  total: januaryData.reduce((sum, d) => sum + d.january, 0),
  average: (januaryData.reduce((sum, d) => sum + d.january, 0) / 31).toFixed(1),
  max: Math.max(...januaryData.map(d => d.january)),
}

const februaryStats = {
  total: februaryData.reduce((sum, d) => sum + d.february, 0),
  average: (februaryData.reduce((sum, d) => sum + d.february, 0) / 9).toFixed(1),
  max: Math.max(...februaryData.map(d => d.february)),
}

export default function DrinkingTracker() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 text-teal-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Molt - Drinking Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Comparing your drinking habits: January vs February 2026
          </p>
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Today: February 9, 2026</span>
          </div>
        </div>

        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Drinking Comparison
            </CardTitle>
            <CardDescription>
              Daily drink count comparison between January 2026 (complete) and February 2026 (in progress)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={combinedData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    labelFormatter={(value) => `Day ${value}`}
                    formatter={(value, name) => [
                      value === null ? 'No data' : `${value} drinks`,
                      name === 'january' ? 'January 2026' : 'February 2026'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value) => (
                      <span style={{ color: 'hsl(var(--foreground))' }}>
                        {value === 'january' ? 'January 2026' : 'February 2026'}
                      </span>
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="january" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3B82F6' }}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="february" 
                    stroke="#14B8A6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#14B8A6' }}
                    activeDot={{ r: 6, fill: '#14B8A6' }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* January Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                January 2026 Summary
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Complete
                </Badge>
              </CardTitle>
              <CardDescription>31 days of tracking data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-blue-400">{januaryStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Drinks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-blue-400">{januaryStats.average}</div>
                  <div className="text-sm text-muted-foreground">Avg per Day</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-blue-400">{januaryStats.max}</div>
                  <div className="text-sm text-muted-foreground">Max in Day</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* February Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                February 2026 Summary
                <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20">
                  In Progress
                </Badge>
              </CardTitle>
              <CardDescription>9 days of tracking data so far</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-teal-400">{februaryStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Drinks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-teal-400">{februaryStats.average}</div>
                  <div className="text-sm text-muted-foreground">Avg per Day</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-teal-400">{februaryStats.max}</div>
                  <div className="text-sm text-muted-foreground">Max in Day</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          <p>Track your daily hydration and drinking habits with Molt</p>
        </div>
      </div>
    </div>
  )
}