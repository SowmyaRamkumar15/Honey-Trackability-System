import React, { useRef, useState } from 'react'
import Button from '../../../components/ui/Button'

export const CertificateUpload = ({ file, onFileChange, currentCertificateUrl }) => {
  const inputRef = useRef(null)
  const [fileName, setFileName] = useState(null)

  const handleSelect = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(selected.type)) {
      alert('Only PDF, JPEG, PNG, or WEBP documents are supported.')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert('Certificate file size must be less than 5MB.')
      return
    }

    onFileChange(selected)
    setFileName(selected.name)
  }

  const handleRemove = () => {
    onFileChange(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label className="hc-input__label">
        Laboratory Certificate Document <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400 }}>(PDF / Image, Max 5MB)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        style={{ display: 'none' }}
        id="lab-certificate-input"
      />

      {fileName || currentCertificateUrl ? (
        <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-light)', background: 'var(--primary-soft)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.75rem' }}>📄</span>
            <div>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {fileName || 'Laboratory Certificate Attached'}
              </p>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '11px' }}>Ready for blockchain recording</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: '100%', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', cursor: 'pointer', transition: 'border-color var(--transition-fast)' }}
        >
          <span style={{ fontSize: '2rem' }}>📄</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>Upload Certificate PDF / Image</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Attach official lab test report or purity certification (Optional)
          </span>
        </button>
      )}
    </div>
  )
}

export default CertificateUpload
