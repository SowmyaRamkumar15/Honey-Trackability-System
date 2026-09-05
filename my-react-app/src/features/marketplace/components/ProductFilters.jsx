import React from 'react'
import { FLOWER_SOURCES, HONEY_REGIONS, SORT_OPTIONS } from '../constants/marketplaceConstants'

/**
 * ProductFilters — search, category, region, price, and sort filters.
 */
const ProductFilters = ({
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="card product-filters">
      <div className="product-filters__header">
        <h3 className="product-filters__title">🔍 Search & Filter Honey</h3>
        <button
          onClick={onReset}
          className="btn btn--ghost btn--sm"
          type="button"
        >
          Reset Filters
        </button>
      </div>

      <div className="product-filters__grid">
        {/* Search Input */}
        <div className="form-group product-filters__search">
          <label className="form-label" htmlFor="filter-search">
            Search Honey or Beekeeper
          </label>
          <input
            id="filter-search"
            type="text"
            className="form-input"
            placeholder="e.g. Raw Wildflower, Nilgiris..."
            defaultValue={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Flower Source Filter */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-flower">
            Flower Source
          </label>
          <select
            id="filter-flower"
            className="form-select"
            value={filters.flowerSource}
            onChange={(e) => onFilterChange('flowerSource', e.target.value)}
          >
            {FLOWER_SOURCES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-region">
            Region
          </label>
          <select
            id="filter-region"
            className="form-select"
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
          >
            {HONEY_REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-sort">
            Sort By
          </label>
          <select
            id="filter-sort"
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters
