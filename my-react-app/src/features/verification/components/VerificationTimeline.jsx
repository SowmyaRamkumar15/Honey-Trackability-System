import React from 'react'
import Card from '../../../components/ui/Card'
import '../styles/verification.css'

export const VerificationTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null

  return (
    <Card header={<h3>⏱️ Traceability Milestone History</h3>}>
      <div className="hc-verify-timeline">
        {timeline.map((item, idx) => (
          <div key={idx} className="hc-verify-timeline-item">
            <div className="hc-verify-timeline-dot">
              <span>{item.icon || '●'}</span>
            </div>

            <div className="hc-verify-timeline-content">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: '4px' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{item.title}</p>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {item.date
                    ? new Date(item.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    : '—'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default VerificationTimeline
