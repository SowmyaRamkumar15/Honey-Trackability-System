import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { LANGUAGES } from '../../i18n/languageConfig'

export const LanguageSelector = ({ variant = 'select', className = '' }) => {
  const { language, setLanguage } = useLanguage()

  if (variant === 'buttons') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }} className={className}>
        {Object.values(LANGUAGES).map((lang) => (
          <button
            key={lang.code}
            type="button"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: language === lang.code ? 'var(--font-bold)' : 'var(--font-semibold)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: language === lang.code ? 'var(--primary)' : 'transparent',
              color: language === lang.code ? 'var(--primary-contrast)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
            onClick={() => setLanguage(lang.code)}
          >
            <span style={{ marginRight: '4px' }}>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <select
        id="language-select"
        style={{
          fontSize: 'var(--text-xs)',
          padding: '6px 12px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontWeight: 'var(--font-semibold)',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--shadow-xs)',
        }}
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select Interface Language"
      >
        {Object.values(LANGUAGES).map((lang) => (
          <option key={lang.code} value={lang.code} style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', padding: '4px' }}>
            {lang.flag} {lang.nativeName} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
