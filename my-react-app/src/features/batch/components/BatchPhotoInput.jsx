import React, { useRef, useState } from 'react'
import Button from '../../../components/ui/Button'
import '../styles/batch.css'

export const BatchPhotoInput = ({ file, onFileChange, currentPhotoUrl = null }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleSelect = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      alert('Only JPEG, PNG, or WEBP images are supported.')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB.')
      return
    }

    onFileChange(selected)
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(selected)
  }

  const handleRemove = () => {
    onFileChange(null)
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const activeDisplay = previewUrl || currentPhotoUrl

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
        Batch Harvest Photo <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>(Optional)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleSelect}
        style={{ display: 'none' }}
        id="batch-photo-input"
      />

      {activeDisplay ? (
        <div className="hc-photo-preview-box">
          <img
            src={activeDisplay}
            alt="Batch harvest preview"
            className="hc-photo-preview-img"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
              {file ? file.name : 'Current Harvest Photo'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
              >
                🔄 Retake
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
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="hc-photo-dropzone"
        >
          <span style={{ fontSize: '2rem' }}>📷</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Add Batch Photo</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Take photo with camera or choose from gallery (Max 5MB)
          </span>
        </button>
      )}
    </div>
  )
}

export default BatchPhotoInput
