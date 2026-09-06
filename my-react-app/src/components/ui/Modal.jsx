import React, { useEffect } from 'react'
import './Modal.css'

/**
 * Modal — Standardized Modal component.
 */
export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="hc-modal-backdrop" onClick={onClose}>
      <div
        className={`hc-modal-dialog ${maxWidth}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="hc-modal-header">
          <h3 className="hc-modal-title">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="hc-modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="hc-modal-content">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="hc-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
