import React, { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export const LocationSelector = ({
  village,
  latitude,
  longitude,
  onVillageChange,
  onLocationChange,
  errors = {},
}) => {
  const [locating, setLocating] = useState(false)
  const [gpsError, setGpsError] = useState(null)
  const [gpsSuccess, setGpsSuccess] = useState(false)

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser')
      return
    }

    setLocating(true)
    setGpsError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4))
        const lng = parseFloat(position.coords.longitude.toFixed(4))
        onLocationChange(lat, lng)
        setLocating(false)
        setGpsSuccess(true)
      },
      () => {
        setLocating(false)
        setGpsError('GPS permission denied or unavailable. Please type your village name below.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* GPS Detection Button */}
      <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--primary-soft)', border: '1px solid var(--primary-light)', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}>
              <span>📍</span> Auto-Detect GPS Location
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: '2px', margin: '2px 0 0 0' }}>
              One-click precise coordinates from your device
            </p>
          </div>
          <Button
            variant={gpsSuccess ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleGetGps}
            loading={locating}
            type="button"
          >
            {gpsSuccess ? '✓ GPS Captured' : '📡 Get GPS'}
          </Button>
        </div>

        {gpsSuccess && latitude && longitude && (
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
            <span>✓ Lat: {latitude}° N, Lng: {longitude}° E</span>
          </div>
        )}

        {gpsError && (
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--danger)', fontWeight: 'var(--font-semibold)' }}>
            {gpsError}
          </div>
        )}
      </div>

      {/* Manual Village Input */}
      <Input
        id="village-input"
        label="Village / Town / District *"
        value={village}
        onChange={(e) => onVillageChange(e.target.value)}
        placeholder="e.g. Kotagiri, Nilgiris, Tamil Nadu"
        error={errors.village}
        required
      />

      {/* Manual Coordinates Override */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', paddingTop: '4px' }}>
        <Input
          id="latitude-input"
          label="Latitude (Optional)"
          type="number"
          step="0.0001"
          value={latitude || ''}
          onChange={(e) => onLocationChange(e.target.value ? parseFloat(e.target.value) : null, longitude)}
          placeholder="e.g. 11.4200"
          error={errors.latitude}
        />
        <Input
          id="longitude-input"
          label="Longitude (Optional)"
          type="number"
          step="0.0001"
          value={longitude || ''}
          onChange={(e) => onLocationChange(latitude, e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="e.g. 76.8800"
          error={errors.longitude}
        />
      </div>
    </div>
  )
}

export default LocationSelector
