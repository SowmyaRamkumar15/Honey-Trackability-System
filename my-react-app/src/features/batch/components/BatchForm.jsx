import React, { useState, useEffect } from 'react'
import QuantityStepper from './QuantityStepper'
import BatchPhotoInput from './BatchPhotoInput'
import Button from '../../../components/ui/Button'
import '../styles/batch.css'

export const BatchForm = ({
  initialValues = {},
  hives = [],
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
  submitLabel = 'Create Batch',
}) => {
  const [hiveId, setHiveId] = useState(initialValues.hiveId || (hives[0]?.id ?? ''))
  const [harvestDate, setHarvestDate] = useState(
    initialValues.harvestDate
      ? typeof initialValues.harvestDate === 'string'
        ? initialValues.harvestDate.substring(0, 10)
        : initialValues.harvestDate
      : new Date().toISOString().substring(0, 10)
  )
  const [quantityKg, setQuantityKg] = useState(initialValues.quantityKg ?? 5.0)
  const [photoFile, setPhotoFile] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isEdit && !hiveId && hives.length > 0) {
      const firstActive = hives.find((h) => h.status === 'ACTIVE') || hives[0]
      if (firstActive) setHiveId(firstActive.id)
    }
  }, [hives, hiveId, isEdit])

  const validate = () => {
    const errs = {}
    if (!isEdit && !hiveId) errs.hiveId = 'Please select a hive'
    if (!harvestDate) errs.harvestDate = 'Harvest date is required'
    if (harvestDate && harvestDate > new Date().toISOString().substring(0, 10)) {
      errs.harvestDate = 'Harvest date cannot be in the future'
    }
    const q = parseFloat(quantityKg)
    if (isNaN(q) || q <= 0) {
      errs.quantityKg = 'Quantity must be greater than 0'
    } else if (q > 10000) {
      errs.quantityKg = 'Quantity cannot exceed 10,000 kg'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const formData = new FormData()
    if (!isEdit) {
      formData.append('hiveId', hiveId)
    }
    formData.append('harvestDate', harvestDate)
    formData.append('quantityKg', quantityKg)
    if (photoFile) {
      formData.append('photo', photoFile)
    }

    onSubmit(formData)
  }

  const activeHives = hives.filter((h) => h.status === 'ACTIVE')

  return (
    <form onSubmit={handleSubmit} className="hc-batch-form">
      {/* Hive Selector (Create Mode Only) */}
      {!isEdit && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
            Select Source Hive *
          </label>
          {activeHives.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--warning-border)', backgroundColor: 'var(--warning-soft)', color: 'var(--warning)', fontSize: 'var(--text-sm)' }}>
              ⚠️ No active hives found. Please register and activate a hive before creating a batch.
            </div>
          ) : (
            <div className="hc-hive-selector-grid">
              {activeHives.map((hive) => {
                const isSelected = String(hiveId) === String(hive.id)
                return (
                  <button
                    key={hive.id}
                    type="button"
                    onClick={() => setHiveId(hive.id)}
                    className={`hc-hive-select-card ${isSelected ? 'hc-hive-select-card--active' : ''}`}
                  >
                    <span style={{ fontSize: '1.5rem', marginTop: '2px' }}>🐝</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                          {hive.hiveCode}
                        </span>
                        {isSelected && (
                          <span style={{ color: 'var(--primary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>✓ Selected</span>
                        )}
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hive.clusterName}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          {errors.hiveId && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>{errors.hiveId}</p>}
        </div>
      )}

      {/* Harvest Date */}
      <div>
        <label htmlFor="batch-harvest-date" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          Harvest Date *
        </label>
        <input
          id="batch-harvest-date"
          type="date"
          value={harvestDate}
          max={new Date().toISOString().substring(0, 10)}
          onChange={(e) => setHarvestDate(e.target.value)}
          className="hc-input"
          required
        />
        {errors.harvestDate && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)', margin: '4px 0 0 0' }}>{errors.harvestDate}</p>}
      </div>

      {/* Quantity Stepper */}
      <QuantityStepper
        value={quantityKg}
        onChange={setQuantityKg}
        error={errors.quantityKg}
      />

      {/* Photo Input */}
      <BatchPhotoInput
        file={photoFile}
        onFileChange={setPhotoFile}
        currentPhotoUrl={initialValues.photoUrl}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-4)' }}>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!isEdit && activeHives.length === 0}
          style={{ flex: 1, paddingBlock: 'var(--space-3)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}
        >
          {loading ? 'Processing Batch...' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            style={{ paddingBlock: 'var(--space-3)', paddingInline: 'var(--space-6)' }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default BatchForm
