import React from 'react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'

export const CertificateViewer = ({ url, onClose }) => {
  if (!url) return null

  const isPdf = url.toLowerCase().endsWith('.pdf')

  return (
    <Modal
      isOpen={!!url}
      onClose={onClose}
      title="Official Laboratory Certificate"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
          {isPdf ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block' }}>📑</span>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', margin: 0 }}>Laboratory Certificate PDF Document</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '320px', margin: 0 }}>
                Official accredited purity analysis report. Click below to view or download.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', paddingTop: 'var(--space-2)', textDecoration: 'none' }}
              >
                <Button variant="primary" size="sm" style={{ fontWeight: 'var(--font-bold)' }}>
                  Open Full PDF Document ↗
                </Button>
              </a>
            </div>
          ) : (
            <img
              src={url}
              alt="Lab Certificate"
              style={{ maxHeight: '380px', width: 'auto', borderRadius: 'var(--radius-xl)', objectFit: 'contain', border: '1px solid var(--border)' }}
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 'var(--space-2)' }}>
          <span>Protected by HoneyChain Blockchain verification</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CertificateViewer
