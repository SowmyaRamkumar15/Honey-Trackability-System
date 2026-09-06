import React from 'react'
import Card from '../../../components/ui/Card'
import LabResultBadge from '../../lab/components/LabResultBadge'
import Button from '../../../components/ui/Button'
import '../styles/verification.css'

export const PurityCard = ({ purity, onOpenCertificate }) => {
  if (!purity) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '2rem' }}>🧪</span>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>Laboratory Testing Pending</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            This honey batch is awaiting accredited laboratory chemical analysis.
          </p>
        </div>
      </Card>
    )
  }

  const isPure = purity.result === 'PURE'

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)' }}>
            🧪 Laboratory Purity Analysis
          </h3>
          <LabResultBadge result={purity.result} size="lg" />
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Purity Score Gauge / Readout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--primary-soft)', border: '1px solid var(--primary-light)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--primary-dark)', textTransform: 'uppercase', fontWeight: 700 }}>Purity Score</p>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)' }}>
              {purity.score}%
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: 'var(--primary-dark)' }}>FSSAI Standard Compliant</p>
          </div>

          <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--background)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Analysis Result</p>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>{purity.result}</p>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: 'var(--text-muted)' }}>
              Tested {purity.testedAt ? new Date(purity.testedAt).toLocaleDateString('en-IN') : '—'}
            </p>
          </div>
        </div>

        {/* Lab Remarks */}
        {purity.remarks && (
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Laboratory Findings: </span>
            <span style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{purity.remarks}</span>
          </div>
        )}

        {/* Certificate Action */}
        {purity.certificateUrl && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Accredited Laboratory Certificate</p>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>Official purity test documentation</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onOpenCertificate(purity.certificateUrl)}
            >
              View Document ↗
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PurityCard
