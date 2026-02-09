'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for January 2026 (complete month)
const januaryData = [
  { day: 1, drinks: 4 },
  { day: 2, drinks: 3 },
  { day: 3, drinks: 6 },
  { day: 4, drinks: 2 },
  { day: 5, drinks: 8 },
  { day: 6, drinks: 5 },
  { day: 7, drinks: 7 },
  { day: 8, drinks: 3 },
  { day: 9, drinks: 4 },
  { day: 10, drinks: 9 },
  { day: 11, drinks: 6 },
  { day: 12, drinks: 2 },
  { day: 13, drinks: 8 },
  { day: 14, drinks: 5 },
  { day: 15, drinks: 7 },
  { day: 16, drinks: 4 },
  { day: 17, drinks: 10 },
  { day: 18, drinks: 6 },
  { day: 19, drinks: 3 },
  { day: 20, drinks: 8 },
  { day: 21, drinks: 5 },
  { day: 22, drinks: 7 },
  { day: 23, drinks: 4 },
  { day: 24, drinks: 12 },
  { day: 25, drinks: 9 },
  { day: 26, drinks: 6 },
  { day: 27, drinks: 8 },
  { day: 28, drinks: 5 },
  { day: 29, drinks: 7 },
  { day: 30, drinks: 4 },
  { day: 31, drinks: 11 },
]

// Mock data for February 2026 (partial month up to day 9)
const februaryData = [
  { day: 1, drinks: 5 },
  { day: 2, drinks: 3 },
  { day: 3, drinks: 7 },
  { day: 4, drinks: 4 },
  { day: 5, drinks: 6 },
  { day: 6, drinks: 8 },
  { day: 7, drinks: 2 },
  { day: 8, drinks: 9 },
  { day: 9, drinks: 5 },
]

// Calculate cumulative sums
const januaryCumulative = januaryData.reduce((acc, curr, index) => {
  const previousSum = index > 0 ? acc[index - 1].january : 0
  acc.push({
    day: curr.day,
    january: previousSum + curr.drinks
  })
  return acc
}, [] as Array<{ day: number; january: number }>)

const februaryCumulative = februaryData.reduce((acc, curr, index) => {
  const previousSum = index > 0 ? acc[index - 1].february : 0
  acc.push({
    day: curr.day,
    february: previousSum + curr.drinks
  })
  return acc
}, [] as Array<{ day: number; february: number }>)

// Combine data for the chart
const combinedData = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  const januaryEntry = januaryCumulative.find(d => d.day === day)
  const februaryEntry = februaryCumulative.find(d => d.day === day)
  
  return {
    day,
    january: januaryEntry?.january || 0,
    february: day <= 9 ? (februaryEntry?.february || 0) : null,
  }
})

// Generate full year data for heatmap
const generateYearData = () => {
  const yearData = []
  const months = [
    { name: 'Jan', days: 31, data: januaryData },
    { name: 'Feb', days: 28, data: februaryData },
  ]

  months.forEach((month, monthIndex) => {
    for (let day = 1; day <= month.days; day++) {
      const dataPoint = month.data.find(d => d.day === day)
      const value = dataPoint ? dataPoint.drinks : 0
      yearData.push({
        date: `2026-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        value,
        month: monthIndex,
        day
      })
    }
  })

  // Add remaining months with 0 values
  for (let monthIndex = 2; monthIndex < 12; monthIndex++) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex]
    for (let day = 1; day <= daysInMonth; day++) {
      yearData.push({
        date: `2026-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        value: 0,
        month: monthIndex,
        day
      })
    }
  }

  return yearData
}

const HeatmapGrid = () => {
  const yearData = generateYearData()
  const maxValue = Math.max(...yearData.map(d => d.value))
  
  const getColor = (value: number) => {
    if (value === 0) return '#ebedf0'
    const intensity = value / maxValue
    if (intensity <= 0.25) return '#9be9a8'
    if (intensity <= 0.5) return '#40c463'
    if (intensity <= 0.75) return '#30a14e'
    return '#216e39'
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Create a grid starting from Sunday of the first week that contains Jan 1
  const firstDate = new Date('2026-01-01')
  const startOfGrid = new Date(firstDate)
  startOfGrid.setDate(firstDate.getDate() - firstDate.getDay())

  const weeks = []
  let currentDate = new Date(startOfGrid)
  
  while (currentDate.getFullYear() === 2026 || weeks.length < 53) {
    const week = []
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dataPoint = yearData.find(d => d.date === dateStr)
      
      week.push({
        date: dateStr,
        value: dataPoint?.value || 0,
        isCurrentYear: currentDate.getFullYear() === 2026
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(week)
    
    if (currentDate.getFullYear() > 2026) break
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">2026 Drinking Activity</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ebedf0' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9be9a8' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#40c463' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#30a14e' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#216e39' }}></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="flex">
        <div className="flex flex-col justify-between pr-2 text-xs text-gray-600 h-[104px]">
          {['Mon', 'Wed', 'Fri'].map((day, i) => (
            <div key={day} style={{ transform: `translateY(${i * 12}px)` }}>{day}</div>
          ))}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            {months.map(month => (
              <div key={month}>{month}</div>
            ))}
          </div>
          
          <div className="flex gap-[1px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[1px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-[11px] h-[11px] rounded-sm cursor-pointer hover:ring-1 hover:ring-gray-400"
                    style={{ 
                      backgroundColor: day.isCurrentYear ? getColor(day.value) : '#ebedf0',
                      opacity: day.isCurrentYear ? 1 : 0.3
                    }}
                    title={`${day.date}: ${day.value} drinks`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DrinkingTracker() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Drinking Tracker
          </h1>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => `Day ${value}`}
                  formatter={(value, name) => [
                    value === null ? 'No data' : `${value} drinks (total)`,
                    name === 'january' ? 'January 2026' : 'February 2026'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="january" 
                  stroke="#9CA3AF" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="february" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <HeatmapGrid />
      </div>
    </div>
  )
}