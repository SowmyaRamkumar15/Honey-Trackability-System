import React from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../../layouts/MainLayout'
import useProducts from '../hooks/useProducts'
import ProductFilters from '../components/ProductFilters'
import ProductGrid from '../components/ProductGrid'
import { useLanguage } from '../../../i18n/LanguageContext'
import VoiceButton from '../../../components/common/VoiceButton'

/**
 * MarketplacePage — public marketplace browsing authentic verified artisan honey.
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
      <div className="marketplace-page">
        {/* Hero Section */}
        <section className="marketplace-hero">
          <div className="container">
            <div className="marketplace-hero__content">
              <div className="flex items-center gap-3 mb-3">
                <span className="badge badge--gold">
                  🍯 100% PURE & BLOCKCHAIN VERIFIED
                </span>
                <VoiceButton textToSpeak={voiceText} size="sm" />
              </div>
              <h1 className="marketplace-hero__title">
                {t('marketplace.title', 'Artisan Honey Directly From Indian Beekeepers')}
              </h1>
              <p className="marketplace-hero__subtitle">
                {t('marketplace.subtitle', 'Trace every jar back to the hive, beekeeper, and lab purity report via cryptographic blockchain proof.')}
              </p>
            </div>
          </div>
        </section>

        {/* Marketplace Content */}
        <section className="marketplace-main section">
          <div className="container">
            <ProductFilters
              filters={filters}
              onSearchChange={updateSearch}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />

            {/* Results Header */}
            <div className="marketplace-results-header mt-6 mb-4">
              <span className="text-secondary">
                Showing <strong>{products.length}</strong> of <strong>{totalElements}</strong> verified honey products
              </span>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} error={error} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination mt-8">
                <button
                  className="btn btn--secondary btn--sm"
                  disabled={filters.page === 0}
                  onClick={() => goToPage(filters.page - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination__info">
                  Page {filters.page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn--secondary btn--sm"
                  disabled={filters.page >= totalPages - 1}
                  onClick={() => goToPage(filters.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default MarketplacePage
