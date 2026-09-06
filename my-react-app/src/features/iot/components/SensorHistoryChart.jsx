import React, { useState } from 'react'

export const SensorHistoryChart = ({ readings = [] }) => {
  const [metric, setMetric] = useState('temperature') // 'temperature', 'humidity', 'beeActivity'

  if (!readings || readings.length === 0) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)' }}>
        No historical sensor readings recorded yet.
      </div>
    )
  }

  // Reverse readings to show chronological left-to-right (oldest to newest)
  const sorted = [...readings].reverse()

  const config = {
    temperature: {
      label: 'Temperature (°C)',
      color: '#D97706',
      unit: '°C',
      min: 25,
      max: 45,
      getVal: (r) => Number(r.temperature),
      normalBand: { min: 32, max: 37 },
    },
    humidity: {
      label: 'Humidity (%)',
      color: '#2563EB',
      unit: '%',
      min: 20,
      max: 100,
      getVal: (r) => Number(r.humidity),
      normalBand: { min: 45, max: 70 },
    },
    beeActivity: {
      label: 'Bee Activity (0-100)',
      color: '#1D4ED8',
      unit: '/100',
      min: 0,
      max: 100,
      getVal: (r) => Number(r.beeActivity),
      normalBand: { min: 70, max: 100 },
    },
  }[metric]

  const values = sorted.map(config.getVal)
  const minVal = Math.min(config.min, ...values)
  const maxVal = Math.max(config.max, ...values)
  const range = maxVal - minVal || 1

  const width = 600
  const height = 180
  const padding = 30

  const points = sorted.map((r, i) => {
    const val = config.getVal(r)
    const x = padding + (i / Math.max(1, sorted.length - 1)) * (width - 2 * padding)
    const y = height - padding - ((val - minVal) / range) * (height - 2 * padding)
    return { x, y, val, r }
  })

  const pathD = points.length > 1
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '')
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Metric Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>Historical Telemetry</span>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
          {[
            { id: 'temperature', label: '🌡️ Temperature' },
            { id: 'humidity', label: '💧 Humidity' },
            { id: 'beeActivity', label: '🐝 Bee Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMetric(tab.id)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: metric === tab.id ? 'var(--font-bold)' : 'var(--font-medium)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: metric === tab.id ? 'var(--primary)' : 'transparent',
                color: metric === tab.id ? 'var(--primary-contrast)' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', overflowX: 'auto', boxShadow: 'var(--shadow-xs)' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '176px' }}>
          {/* Background Grid Lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(0,0,0,0.06)" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(0,0,0,0.06)" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(0,0,0,0.1)" />

          {/* Value Labels on Y-axis */}
          <text x={padding - 5} y={padding + 4} textAnchor="end" fill="#64748B" fontSize="10" fontFamily="monospace">
            {Math.round(maxVal)}
          </text>
          <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="#64748B" fontSize="10" fontFamily="monospace">
            {Math.round(minVal)}
          </text>

          {/* Connecting Path */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke={config.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#FFFFFF"
                stroke={config.color}
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)' }}>
          <span>Oldest Reading</span>
          <span>Latest Telemetry Stream</span>
        </div>
      </div>
    </div>
  )
}

export default SensorHistoryChart
