import React from 'react'

const LANGUAGES = [
  { code: 'ENGLISH', label: 'English', native: 'English', icon: '🌐' },
  { code: 'TAMIL', label: 'Tamil', native: 'தமிழ்', icon: '🍯' },
  { code: 'HINDI', label: 'Hindi', native: 'हिन्दी', icon: '🇮🇳' },
]

export const LanguageSelector = ({ selectedLanguage, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
        Preferred Communication Language *
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        {LANGUAGES.map(({ code, label, native, icon }) => {
          const isSelected = selectedLanguage === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-2xl)',
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
              }}
            >
              <div>
                <span style={{ fontSize: '1.25rem', marginRight: 'var(--space-2)' }}>{icon}</span>
                <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>{label}</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: '2px', margin: '2px 0 0 0' }}>{native}</p>
              </div>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? 'var(--primary-contrast)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 'var(--font-bold)',
                }}
              >
                {isSelected && '✓'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LanguageSelector
