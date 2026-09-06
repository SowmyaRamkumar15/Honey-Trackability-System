import React, { useState } from 'react'
import Button from '../../../components/ui/Button'
import '../styles/hive.css'

export const HiveLocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const [locating, setLocating] = useState(false)
  const [gpsError, setGpsError] = useState(null)
  const [gpsSuccess, setGpsSuccess] = useState(false)

  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported by your browser')
      return
    }
    setLocating(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4))
        const lng = parseFloat(pos.coords.longitude.toFixed(4))
        onLocationChange(lat, lng)
        setLocating(false)
        setGpsSuccess(true)
      },
      () => {
        setLocating(false)
        setGpsError('GPS unavailable. Enter coordinates manually or skip.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
        Hive Location <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)' }}>(Optional)</span>
      </label>

      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
        <div>
          <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}>
            <span>📍</span> Auto-Detect GPS
          </p>
          {gpsSuccess && latitude && (
            <p style={{ color: 'var(--primary-dark)', fontSize: 'var(--text-xs)', marginTop: '4px', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', margin: '4px 0 0 0' }}>
              ✓ {latitude}°N, {longitude}°E
            </p>
          )}
          {gpsError && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', marginTop: '4px', fontWeight: 'var(--font-semibold)', margin: '4px 0 0 0' }}>{gpsError}</p>}
        </div>
        <Button
          variant={gpsSuccess ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleGps}
          loading={locating}
          type="button"
        >
          {gpsSuccess ? '✓ Captured' : '📡 Get GPS'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div>
          <label htmlFor="hive-lat" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 'var(--font-medium)' }}>Latitude</label>
          <input
            id="hive-lat"
            type="number"
            step="0.0001"
            value={latitude ?? ''}
            onChange={(e) => onLocationChange(e.target.value ? parseFloat(e.target.value) : null, longitude)}
            placeholder="e.g. 11.4200"
            className="hc-input"
          />
        </div>
        <div>
          <label htmlFor="hive-lng" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 'var(--font-medium)' }}>Longitude</label>
          <input
            id="hive-lng"
            type="number"
            step="0.0001"
            value={longitude ?? ''}
            onChange={(e) => onLocationChange(latitude, e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="e.g. 76.8800"
            className="hc-input"
          />
        </div>
      </div>
    </div>
  )
}

export default HiveLocationPicker
