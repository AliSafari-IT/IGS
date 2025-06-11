import React, { memo } from 'react';
import './ProductFilters.css';

interface ProductFiltersProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  filterInStock: boolean;
  onStockFilterChange: (inStock: boolean) => void;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  categories?: string[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = memo(({
  sortBy,
  onSortChange,
  filterInStock,
  onStockFilterChange,
  priceRange = [0, 1000],
  onPriceRangeChange,
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  className = ''
}) => {
  const handleCategoryToggle = (category: string) => {
    if (!onCategoryChange) return;
    
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoryChange(updatedCategories);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (!onPriceRangeChange) return;
    
    const newRange: [number, number] = type === 'min' 
      ? [value, priceRange[1]]
      : [priceRange[0], value];
    
    onPriceRangeChange(newRange);
  };

  return (
    <div className={`product-filters ${className}`} role="region" aria-label="Product filters">
      <div className="filters-section">
        <h3 className="filters-title">Filters</h3>
        
        {/* Sort Options */}
        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-label">Sort By</label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
            aria-describedby="sort-desc"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="newest">Newest First</option>
            <option value="popularity">Most Popular</option>
          </select>
          <span id="sort-desc" className="sr-only">
            Choose how to sort the product list
          </span>
        </div>

        {/* Stock Filter */}
        <div className="filter-group">
          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={(e) => onStockFilterChange(e.target.checked)}
              className="filter-checkbox-input"
              aria-describedby="stock-desc"
            />
            <span className="filter-checkbox-text">In Stock Only</span>
          </label>
          <span id="stock-desc" className="filter-description">
            Show only products currently available
          </span>
        </div>

        {/* Price Range Filter */}
        {onPriceRangeChange && (
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-range-container">
              <div className="price-input-group">
                <label htmlFor="min-price" className="sr-only">Minimum price</label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  className="price-input"
                  placeholder="Min"
                  aria-label="Minimum price"
                />
                <span className="price-separator">-</span>
                <label htmlFor="max-price" className="sr-only">Maximum price</label>
                <input
                  id="max-price"
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  className="price-input"
                  placeholder="Max"
                  aria-label="Maximum price"
                />
              </div>
              <div className="price-range-display">
                €{priceRange[0]} - €{priceRange[1]}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && onCategoryChange && (
          <div className="filter-group">
            <label className="filter-label">Categories</label>
            <div className="category-filter-list" role="group" aria-label="Product categories">
              {categories.map((category) => (
                <label key={category} className="filter-checkbox-label category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="filter-checkbox-input"
                    aria-describedby={`cat-${category}-desc`}
                  />
                  <span className="filter-checkbox-text category-name">
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <div className="filter-actions">
          <button
            type="button"
            onClick={() => {
              onSortChange('name');
              onStockFilterChange(false);
              onPriceRangeChange?.([0, 1000]);
              onCategoryChange?.([]);
            }}
            className="clear-filters-btn"
            aria-label="Clear all filters"
          >
            <i className="fa fa-times" aria-hidden="true"></i>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
});

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;
