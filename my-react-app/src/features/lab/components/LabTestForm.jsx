import React, { useState } from 'react'
import PurityScoreInput from './PurityScoreInput'
import CertificateUpload from './CertificateUpload'
import StatusButtonGroup from './StatusButtonGroup'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import '../styles/lab.css'

export const LabTestForm = ({ onSubmit, loading, batchId, initialResult = null }) => {
  const [purityScore, setPurityScore] = useState(98)
  const [result, setResult] = useState(initialResult)
  const [remarks, setRemarks] = useState('')
  const [certificateFile, setCertificateFile] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (purityScore === null || purityScore === undefined || isNaN(purityScore)) {
      errs.purityScore = 'Purity score is required'
    } else if (purityScore < 0 || purityScore > 100) {
      errs.purityScore = 'Purity score must be between 0 and 100'
    }
    if (!result) {
      errs.result = 'Please select a test status.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePreSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = () => {
    setShowConfirm(false)
    const formData = new FormData()
    formData.append('purityScore', purityScore)
    formData.append('result', result)
    if (remarks.trim()) formData.append('remarks', remarks.trim())
    if (certificateFile) formData.append('certificate', certificateFile)
    onSubmit(formData)
  }

  return (
    <form onSubmit={handlePreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Interactive Status Button Group */}
      <StatusButtonGroup
        value={result}
        onChange={(newResult) => {
          setResult(newResult)
          if (errors.result) {
            setErrors((prev) => ({ ...prev, result: null }))
          }
        }}
        disabled={loading}
        error={errors.result}
      />

      {/* Purity Score */}
      <PurityScoreInput
        value={purityScore}
        onChange={setPurityScore}
        error={errors.purityScore}
      />

      {/* Certificate Upload */}
      <CertificateUpload
        file={certificateFile}
        onFileChange={setCertificateFile}
      />

      {/* Remarks */}
      <div>
        <label className="hc-input__label">
          Lab Remarks & Testing Notes
        </label>
        <textarea
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g. Moisture: 17.2%, Sucrose: 1.5%, HMF: 12mg/kg. Complies with FSSAI standards."
          className="hc-input__field"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Submit Action */}
      <div>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          size="lg"
          disabled={loading || !result}
          style={{ width: '100%' }}
        >
          {loading ? 'Submitting Laboratory Result...' : 'Submit Laboratory Result'}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Lab Submission"
        footer={
          <div style={{ display: 'flex', gap: 'var(--space-2)', width: '100%', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmedSubmit}
            >
              Confirm & Record
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🧪</div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Submit lab test for batch <strong style={{ color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)' }}>{batchId}</strong> with result{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{result}</strong> ({purityScore}% purity)?
          </p>
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', fontSize: 'var(--text-xs)', color: 'var(--primary-dark)', fontWeight: 600 }}>
            ⚠️ This will create an immutable LAB_RESULT blockchain record that cannot be edited.
          </div>
        </div>
      </Modal>
    </form>
  )
}

export default LabTestForm
