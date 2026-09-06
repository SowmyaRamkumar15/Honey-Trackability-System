import React from 'react'
import { FLOWER_SOURCES, HONEY_REGIONS, SORT_OPTIONS } from '../constants/marketplaceConstants'
import Button from '../../../components/ui/Button'
import '../styles/marketplace.css'

/**
 * ProductFilters — executive search, category, region, and sort filter bar.
 */
const ProductFilters = ({
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}) => {
  const popularSources = ['MULTIFLORA', 'JAMUN', 'MUSTARD', 'SUNFLOWER', 'KARANJ']

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.flowerSource) ||
    Boolean(filters.region) ||
    filters.sortBy !== 'newest'

  return (
    <div className="hc-market-filters">
      {/* Top Header Row */}
      <div className="hc-market-filters__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.5rem' }}>🔍</span>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Filter Verified Honey
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Narrow down by botanical floral source, apiary territory, or purity tier.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} style={{ color: 'var(--danger)', fontWeight: 'var(--font-bold)' }}>
            ✕ Reset Filters
          </Button>
        )}
      </div>

      {/* Main Filter Controls Grid */}
      <div className="hc-market-filters__grid">
        {/* Search Input */}
        <div className="hc-market-filter-group">
          <label className="hc-market-filter-label" htmlFor="filter-search">
            Search Honey / Beekeeper
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="filter-search"
              type="text"
              className="hc-market-filter-input"
              placeholder="e.g. Wildflower, Nilgiris, Ramesh..."
              value={filters.search || ''}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'bold',
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Flower Source Filter */}
        <div className="hc-market-filter-group">
          <label className="hc-market-filter-label" htmlFor="filter-flower">
            Flower Source
          </label>
          <select
            id="filter-flower"
            className="hc-market-filter-input"
            value={filters.flowerSource || ''}
            onChange={(e) => onFilterChange('flowerSource', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {FLOWER_SOURCES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="hc-market-filter-group">
          <label className="hc-market-filter-label" htmlFor="filter-region">
            Geographic Region
          </label>
          <select
            id="filter-region"
            className="hc-market-filter-input"
            value={filters.region || ''}
            onChange={(e) => onFilterChange('region', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {HONEY_REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="hc-market-filter-group">
          <label className="hc-market-filter-label" htmlFor="filter-sort">
            Sort Order
          </label>
          <select
            id="filter-sort"
            className="hc-market-filter-input"
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="hc-market-chips">
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Popular:</span>
        <button
          type="button"
          onClick={() => onFilterChange('flowerSource', '')}
          className={`hc-market-chip ${!filters.flowerSource ? 'hc-market-chip--active' : ''}`}
        >
          All Honey
        </button>
        {popularSources.map((src) => {
          const match = FLOWER_SOURCES.find((f) => f.value === src)
          const isSelected = filters.flowerSource === src
          return (
            <button
              key={src}
              type="button"
              onClick={() => onFilterChange('flowerSource', isSelected ? '' : src)}
              className={`hc-market-chip ${isSelected ? 'hc-market-chip--active' : ''}`}
            >
              🍯 {match?.label || src}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProductFilters
