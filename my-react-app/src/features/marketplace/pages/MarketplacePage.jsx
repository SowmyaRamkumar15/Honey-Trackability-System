import React from 'react'
import MainLayout from '../../../layouts/MainLayout'
import useProducts from '../hooks/useProducts'
import ProductFilters from '../components/ProductFilters'
import ProductGrid from '../components/ProductGrid'
import Button from '../../../components/ui/Button'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'
import '../styles/marketplace.css'

/**
 * MarketplacePage — premier public marketplace for authentic verified artisan honey.
 */
const MarketplacePage = () => {
  const { t } = useLanguage()
  const {
    products,
    filters,
    totalElements,
    totalPages,
    loading,
    error,
    updateFilter,
    updateSearch,
    goToPage,
    resetFilters,
  } = useProducts()

  const voiceText = `${t('marketplace.title', 'Artisan Honey Directly From Indian Beekeepers')}. ${t('marketplace.subtitle', 'Trace every jar back to the hive, beekeeper, and lab purity report via cryptographic blockchain proof.')}`

  return (
    <MainLayout>
      <div className="hc-market-page" style={{ paddingBottom: 'var(--space-10)' }}>
        {/* Modern Marketplace Hero */}
        <section className="hc-market-hero">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="hc-market-hero__tag">
              🍯 100% PURE & BLOCKCHAIN VERIFIED
            </span>
            <VoiceButton textToSpeak={voiceText} size="sm" />
          </div>

          <h1 className="hc-market-hero__title">
            {t('marketplace.title', 'Artisan Honey Directly From Indian Beekeepers')}
          </h1>

          <p className="hc-market-hero__desc">
            {t(
              'marketplace.subtitle',
              'Trace every jar back to the hive, beekeeper, and lab purity report via cryptographic blockchain proof.'
            )}
          </p>

          {/* 3 Core Trust Guarantees */}
          <div className="hc-market-hero__guarantees">
            <span className="hc-market-hero__badge">
              🛡️ KVIC Certified Apiaries
            </span>
            <span className="hc-market-hero__badge">
              🔬 Lab Tested Purity
            </span>
            <span className="hc-market-hero__badge">
              ⛓️ Cryptographic QR Provenance
            </span>
          </div>
        </section>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onSearchChange={updateSearch}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {/* Results Summary Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-2) 0',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{products.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{totalElements}</strong> verified honey products
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--info)',
              background: 'rgba(37, 99, 235, 0.08)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
            }}
          >
            Live Verified Harvests
          </span>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-4)' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page === 0}
              onClick={() => goToPage(filters.page - 1)}
            >
              ← Previous
            </Button>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', padding: 'var(--space-1) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              Page {filters.page + 1} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page >= totalPages - 1}
              onClick={() => goToPage(filters.page + 1)}
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default MarketplacePage
