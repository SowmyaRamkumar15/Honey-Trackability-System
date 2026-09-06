import React, { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import HiveLocationPicker from './HiveLocationPicker'
import '../styles/hive.css'

export const HiveForm = ({ initialValues = {}, onSubmit, loading = false, onCancel, submitLabel = 'Save Hive' }) => {
  const [formData, setFormData] = useState({
    clusterName: initialValues.clusterName || '',
    latitude: initialValues.latitude ?? null,
    longitude: initialValues.longitude ?? null,
    installedDate: initialValues.installedDate
      ? (typeof initialValues.installedDate === 'string'
          ? initialValues.installedDate.substring(0, 10)
          : initialValues.installedDate)
      : new Date().toISOString().substring(0, 10),
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.clusterName.trim()) errs.clusterName = 'Cluster name is required'
    if (!formData.installedDate) errs.installedDate = 'Installation date is required'
    if (formData.installedDate && formData.installedDate > new Date().toISOString().substring(0, 10)) {
      errs.installedDate = 'Installation date cannot be in the future'
    }
    if (formData.latitude !== null && (formData.latitude < -90 || formData.latitude > 90)) {
      errs.latitude = 'Latitude must be between -90 and 90'
    }
    if (formData.longitude !== null && (formData.longitude < -180 || formData.longitude > 180)) {
      errs.longitude = 'Longitude must be between -180 and 180'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      clusterName: formData.clusterName.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      installedDate: formData.installedDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Input
        id="hive-cluster-name"
        label="Cluster Name *"
        value={formData.clusterName}
        onChange={(e) => setFormData({ ...formData, clusterName: e.target.value })}
        placeholder="e.g. Nilgiris Cluster"
        error={errors.clusterName}
        required
      />

      <div>
        <label htmlFor="hive-installed-date" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Installation Date *</label>
        <input
          id="hive-installed-date"
          type="date"
          value={formData.installedDate}
          max={new Date().toISOString().substring(0, 10)}
          onChange={(e) => setFormData({ ...formData, installedDate: e.target.value })}
          className="hc-input"
          required
        />
        {errors.installedDate && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', marginTop: '4px', fontWeight: 'var(--font-semibold)' }}>{errors.installedDate}</p>}
      </div>

      <HiveLocationPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
        <Button type="submit" variant="primary" loading={loading} style={{ flex: 1, paddingBlock: 'var(--space-3)', fontWeight: 'var(--font-bold)' }}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} style={{ paddingBlock: 'var(--space-3)', paddingInline: 'var(--space-6)' }}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default HiveForm
