/**
 * Native Shopify Collection Filtering and Sorting (Pure Shine Home Style)
 * Handles availability filters, price range inputs, and sorting using Shopify's native filtering system
 */

class CollectionFilters {
  constructor() {
    this.form = document.getElementById('FacetFiltersForm');
    this.priceTimeout = null;
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.bindSortEvents();
    this.bindFilterEvents();
    this.bindDropdownEvents();
  }

  bindSortEvents() {
    const sortOptions = document.querySelectorAll('.sort-option');
    
    sortOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const sortValue = option.getAttribute('data-value');
        this.setSortBy(sortValue);
      });
    });
  }

  bindFilterEvents() {
    // Availability filter (multiple checkboxes but only one can be selected)
    const availabilityCheckboxes = document.querySelectorAll('input[name="filter.v.availability"]');
    availabilityCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        // Uncheck other availability checkboxes
        availabilityCheckboxes.forEach(cb => {
          if (cb !== checkbox) cb.checked = false;
        });
        
        this.updateAvailabilityFilter(checkbox.checked ? checkbox.value : '');
      });
    });

    // Price filter inputs (no auto-update, only on Enter or blur)
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const clearPriceButton = document.querySelector('.clear-price-filter');

    if (priceMinInput && priceMaxInput) {
      const handlePriceUpdate = () => {
        this.updatePriceFilter(priceMinInput.value, priceMaxInput.value);
      };

      // Update on Enter key
      const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
          handlePriceUpdate();
        }
      };

      priceMinInput.addEventListener('keydown', handleEnterKey);
      priceMaxInput.addEventListener('keydown', handleEnterKey);
      
      // Update on blur only when BOTH inputs lose focus (not when tabbing between them)
      const handleBlur = () => {
        setTimeout(() => {
          const focused = document.activeElement;
          if (focused !== priceMinInput && focused !== priceMaxInput) {
            const hasValue = priceMinInput.value.trim() !== '' || priceMaxInput.value.trim() !== '';
            if (hasValue) handlePriceUpdate();
          }
        }, 150);
      };

      priceMinInput.addEventListener('blur', handleBlur);
      priceMaxInput.addEventListener('blur', handleBlur);
    }

    // Clear price filter button
    if (clearPriceButton) {
      clearPriceButton.addEventListener('click', () => {
        this.clearPriceFilter();
      });
    }

    // Clear all filters button
    const clearAllButton = document.querySelector('.clear-all-filters');
    if (clearAllButton) {
      clearAllButton.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }

  bindDropdownEvents() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const filterGroups = document.querySelectorAll('.filter-group[open]');
      const sortDropdown = document.querySelector('.sort-dropdown[open]');
      
      filterGroups.forEach(group => {
        if (!group.contains(event.target)) {
          group.removeAttribute('open');
        }
      });
      
      if (sortDropdown && !sortDropdown.contains(event.target)) {
        sortDropdown.removeAttribute('open');
      }
    });
  }

  setSortBy(sortValue) {
    const url = new URL(window.location);
    
    if (sortValue === 'manual') {
      url.searchParams.delete('sort_by');
    } else {
      url.searchParams.set('sort_by', sortValue);
    }
    
    // Reset to first page when sorting
    url.searchParams.delete('page');
    
    window.location.href = url.toString();
  }

  updateAvailabilityFilter(value) {
    const url = new URL(window.location);
    
    if (value === '') {
      url.searchParams.delete('filter.v.availability');
    } else {
      url.searchParams.set('filter.v.availability', value);
    }
    
    // Reset to first page when filtering
    url.searchParams.delete('page');
    
    window.location.href = url.toString();
  }

  updatePriceFilter(minValue, maxValue) {
    const url = new URL(window.location);
    
    // Clear existing price filters
    url.searchParams.delete('filter.v.price.gte');
    url.searchParams.delete('filter.v.price.lte');
    
    if (minValue && minValue.trim() !== '') {
      const minVal = parseFloat(minValue);
      if (!isNaN(minVal) && minVal >= 0) {
        url.searchParams.set('filter.v.price.gte', minVal.toString());
      }
    }
    
    if (maxValue && maxValue.trim() !== '') {
      const maxVal = parseFloat(maxValue);
      if (!isNaN(maxVal) && maxVal > 0) {
        url.searchParams.set('filter.v.price.lte', maxVal.toString());
      }
    }
    
    // Reset to first page when filtering
    url.searchParams.delete('page');
    
    window.location.href = url.toString();
  }

  clearPriceFilter() {
    const url = new URL(window.location);
    
    // Clear price filter parameters
    url.searchParams.delete('filter.v.price.gte');
    url.searchParams.delete('filter.v.price.lte');
    url.searchParams.delete('page');
    
    window.location.href = url.toString();
  }

  clearAllFilters() {
    const url = new URL(window.location);
    
    // Clear all filter parameters
    url.searchParams.delete('filter.v.availability');
    url.searchParams.delete('filter.v.price.gte');
    url.searchParams.delete('filter.v.price.lte');
    url.searchParams.delete('sort_by');
    url.searchParams.delete('page');
    
    window.location.href = url.toString();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CollectionFilters();
});

// Export for potential external use
window.CollectionFilters = CollectionFilters;