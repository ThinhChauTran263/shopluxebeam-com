/**
 * LuxeBeam Theme JavaScript
 * Main theme functionality
 */

// Theme utilities
window.theme = window.theme || {};

// Safe console logging
const safeLog = (message, data = null) => {
  if (typeof console !== 'undefined' && console.log) {
    console.log(message, data);
  }
};

// Cart functionality
theme.cart = {
  addItem: function(variantId, quantity = 1) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      safeLog('Cart add error:', error);
      throw error;
    });
  },

  updateItem: function(key, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: key,
        quantity: quantity
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      safeLog('Cart update error:', error);
      throw error;
    });
  },

  getCart: function() {
    return fetch('/cart.js')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        safeLog('Cart get error:', error);
        throw error;
      });
  }
};

// Product functionality
theme.product = {
  init: function() {
    try {
      this.initVariantSelection();
      this.initQuantityButtons();
    } catch (error) {
      safeLog('Product init error:', error);
    }
  },

  initVariantSelection: function() {
    const variantSelects = document.querySelectorAll('.variant-select');
    variantSelects.forEach(select => {
      select.addEventListener('change', this.handleVariantChange.bind(this));
    });
  },

  initQuantityButtons: function() {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
      button.addEventListener('click', this.handleQuantityChange.bind(this));
    });
  },

  handleVariantChange: function(event) {
    try {
      // Handle variant selection logic
      const form = event.target.closest('form');
      if (form) {
        const selectedOptions = Array.from(form.querySelectorAll('.variant-select')).map(select => select.value);
        // Update price, availability, etc.
      }
    } catch (error) {
      safeLog('Variant change error:', error);
    }
  },

  handleQuantityChange: function(event) {
    try {
      const button = event.target;
      const input = button.parentNode.querySelector('input[type="number"]');
      if (input) {
        const currentValue = parseInt(input.value) || 1;
        
        if (button.classList.contains('quantity-plus')) {
          input.value = currentValue + 1;
        } else if (button.classList.contains('quantity-minus') && currentValue > 1) {
          input.value = currentValue - 1;
        }
      }
    } catch (error) {
      safeLog('Quantity change error:', error);
    }
  }
};

// Collection functionality
theme.collection = {
  init: function() {
    try {
      this.initSorting();
      this.initFiltering();
    } catch (error) {
      safeLog('Collection init error:', error);
    }
  },

  initSorting: function() {
    const sortSelect = document.getElementById('SortBy');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        try {
          const url = new URL(window.location);
          url.searchParams.set('sort_by', this.value);
          window.location.href = url.toString();
        } catch (error) {
          safeLog('Sort error:', error);
        }
      });
    }
  },

  initFiltering: function() {
    // Add filtering logic here
  }
};

// Search functionality
theme.search = {
  init: function() {
    try {
      this.initPredictiveSearch();
    } catch (error) {
      safeLog('Search init error:', error);
    }
  },

  initPredictiveSearch: function() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
      input.addEventListener('input', this.handleSearchInput.bind(this));
    });
  },

  handleSearchInput: function(event) {
    try {
      const query = event.target.value;
      if (query.length > 2) {
        // Implement predictive search
      }
    } catch (error) {
      safeLog('Search input error:', error);
    }
  }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    theme.product.init();
    theme.collection.init();
    theme.search.init();
    
    // Initialize other components
    safeLog('LuxeBeam theme loaded successfully');
  } catch (error) {
    safeLog('Theme initialization error:', error);
  }
});