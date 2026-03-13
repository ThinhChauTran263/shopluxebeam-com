/**
 * LuxeBeam Theme JavaScript
 * Main theme functionality
 */

// Theme utilities
window.theme = window.theme || {};

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
    }).then(response => response.json());
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
    }).then(response => response.json());
  },

  getCart: function() {
    return fetch('/cart.js').then(response => response.json());
  }
};

// Product functionality
theme.product = {
  init: function() {
    this.initVariantSelection();
    this.initQuantityButtons();
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
    // Handle variant selection logic
    const form = event.target.closest('form');
    const selectedOptions = Array.from(form.querySelectorAll('.variant-select')).map(select => select.value);
    // Update price, availability, etc.
  },

  handleQuantityChange: function(event) {
    const button = event.target;
    const input = button.parentNode.querySelector('input[type="number"]');
    const currentValue = parseInt(input.value);
    
    if (button.classList.contains('quantity-plus')) {
      input.value = currentValue + 1;
    } else if (button.classList.contains('quantity-minus') && currentValue > 1) {
      input.value = currentValue - 1;
    }
  }
};

// Collection functionality
theme.collection = {
  init: function() {
    this.initSorting();
    this.initFiltering();
  },

  initSorting: function() {
    const sortSelect = document.getElementById('SortBy');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        const url = new URL(window.location);
        url.searchParams.set('sort_by', this.value);
        window.location.href = url.toString();
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
    this.initPredictiveSearch();
  },

  initPredictiveSearch: function() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
      input.addEventListener('input', this.handleSearchInput.bind(this));
    });
  },

  handleSearchInput: function(event) {
    const query = event.target.value;
    if (query.length > 2) {
      // Implement predictive search
    }
  }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  theme.product.init();
  theme.collection.init();
  theme.search.init();
  
  // Initialize other components
  console.log('LuxeBeam theme loaded');
});