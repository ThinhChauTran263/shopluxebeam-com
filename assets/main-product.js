/* Main Product Section JavaScript */


// Complete override of Shopify cart behavior
(function() {
  // Block all Shopify cart form submissions and loading states
  document.addEventListener('submit', function(e) {
    if (e.target.action && e.target.action.includes('cart/add')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);
  
  // Override Shopify's loading states
  document.addEventListener('DOMContentLoaded', function() {
    // Remove Shopify's loading classes
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.classList) {
          if (mutation.target.classList.contains('btn--loading') || 
              mutation.target.classList.contains('loading')) {
            mutation.target.classList.remove('btn--loading', 'loading');
          }
        }
      });
    });
    
    // Observe all buttons for class changes
    document.querySelectorAll('button').forEach(button => {
      observer.observe(button, { attributes: true, attributeFilter: ['class'] });
    });
  });
})();



// Thumbnail gallery
document.addEventListener('DOMContentLoaded', function() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('main-product-image');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const newSrc = this.dataset.image;
      mainImage.src = newSrc;
      
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Bundle selection
  const bundleOptions = document.querySelectorAll('.bundle-option input[type="radio"]');
  bundleOptions.forEach(option => {
    option.addEventListener('change', function() {
      console.log('Selected bundle:', this.value);
    });
  });

  // Custom Add to Cart functionality with complete override
  const addToCartBtn = document.querySelector('.custom-add-to-cart');
  
  if (addToCartBtn) {
    // Completely replace the button to remove all Shopify event listeners
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    
    // Remove any Shopify classes that might interfere
    newBtn.classList.remove('btn--loading', 'loading', 'btn-loading');
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      // Don't proceed if already in a state
      if (this.classList.contains('loading') || 
          this.classList.contains('success') || 
          this.disabled) {
        return false;
      }
      
      // Get variant ID
      const variantId = this.dataset.variantId;
      if (!variantId) {
        console.error('No variant ID found');
        return false;
      }
      
      // Start loading state - show custom spinner
      this.classList.add('loading');
      this.disabled = true;
      
      console.log('Starting add to cart process...');
      
      // First, check current cart to see if we can add more
      fetch('/cart.js')
        .then(r => r.json())
        .then(cartData => {
          console.log('Current cart:', cartData);
          
          // Find if this variant is already in cart
          const existingItem = cartData.items.find(item => item.variant_id == variantId);
          const currentQty = existingItem ? existingItem.quantity : 0;
          
          console.log('Current quantity in cart:', currentQty);
          
          // Get inventory from product data
          const inventoryQty = parseInt(this.dataset.inventory) || 999;
          console.log('Available inventory:', inventoryQty);
          
          // Check if we can add more
          if (currentQty >= inventoryQty) {
            throw new Error('Maximum available quantity reached');
          }
          
          // Add to cart via AJAX
          return fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              id: variantId,
              quantity: 1
            })
          });
        })
        .then(response => {
          console.log('Add to cart response:', response.status);
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.description || err.message || 'Failed to add to cart');
            });
          }
          return response.json();
        })
      .then(data => {
        console.log('Product added successfully:', data);
        
        // Success state - show checkmark
        this.classList.remove('loading');
        this.classList.add('success');
        
        // Let cart-drawer.liquid handle all cart updates
        // Just dispatch a custom event to notify cart-drawer
        document.dispatchEvent(new CustomEvent('cart:updated', { 
          detail: { 
            action: 'add',
            variantId: variantId,
            quantity: 1
          }
        }));
        
        // Reset button after 3 seconds
        setTimeout(() => {
          this.classList.remove('success');
          this.disabled = false;
        }, 3000);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        
        // Reset button state on error
        this.classList.remove('loading');
        this.disabled = false;
        
        // Show generic toast notification
        showToast('Maximum available quantity reached', 'error');
      });
      
      return false;
    });
  }
  
  // Beautiful Toast Notification Function
  function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'custom-toast custom-toast-' + type;
    
    // Icon based on type
    let icon = '';
    if (type === 'error') {
      icon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else if (type === 'success') {
      icon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else {
      icon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    toast.innerHTML = '<div class="custom-toast-icon">' + icon + '</div><div class="custom-toast-message">' + message + '</div>';
    
    // Add to body
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('custom-toast-show');
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('custom-toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
  
  // Function to update cart count immediately and accurately
  function updateCartCountImmediate() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('Current cart:', cart);
        
        // Update all possible cart count selectors
        const cartCountSelectors = [
          '.cart-count', 
          '[data-cart-count]', 
          '.cart-item-count', 
          '.header-cart-count', 
          '.cart-counter', 
          '.cart-badge',
          '.cart-count-badge',
          '.cart-bubble',
          '.header__icon--cart .cart-count',
          '.site-header__cart-count',
          '.cart-link .cart-count'
        ];
        
        cartCountSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.textContent = cart.item_count;
            element.setAttribute('data-count', cart.item_count);
            
            // Show/hide badge based on count
            if (cart.item_count > 0) {
              element.style.display = 'block';
              element.style.visibility = 'visible';
              element.style.opacity = '1';
            } else {
              element.style.display = 'none';
            }
          });
        });
        
        // Force update any hidden elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          if (el.textContent && el.textContent.match(/^\(\d+\)$/)) {
            el.textContent = `(${cart.item_count})`;
          }
        });
        
        console.log('Cart count updated to:', cart.item_count);
      })
      .catch(error => {
        console.error('Error updating cart count:', error);
      });
  }
  
  // Force refresh cart drawer with multiple methods - IMMEDIATE
  function forceRefreshCartDrawer() {
    console.log('Force refreshing cart drawer IMMEDIATELY...');
    
    // Method 1: Open drawer immediately without closing first
    openCartDrawer();
    
    // Method 2: Refresh content in background while drawer is open
    setTimeout(() => {
      refreshAndOpenCartDrawer();
    }, 10); // Very minimal delay just for content refresh
  }
  
  // Function to refresh cart content and open drawer
  function refreshAndOpenCartDrawer() {
    // Get the latest cart data
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('Latest cart data:', cart);
        
        // Try multiple refresh methods
        Promise.all([
          refreshCartDrawerViaSection(),
          refreshCartDrawerViaAjax(),
          updateCartDrawerManually(cart)
        ]).then(() => {
          // Fix text wrapping after refresh
          fixCartHeaderTextWrapping();
          
          // Drawer is already open, just ensure it stays open
          console.log('Cart drawer content refreshed while open');
        });
      })
      .catch(error => {
        console.error('Error getting cart data:', error);
        openCartDrawer();
      });
  }
  
  // Method 1: Refresh via section rendering
  function refreshCartDrawerViaSection() {
    return fetch('/cart?sections=cart-drawer,cart-notification-product,cart-notification-button,cart-icon-bubble')
      .then(response => response.json())
      .then(sections => {
        console.log('Section data received:', sections);
        
        // Update cart drawer if section exists
        if (sections['cart-drawer']) {
          const drawer = document.querySelector('.cart-drawer, #cart-drawer');
          if (drawer) {
            drawer.innerHTML = sections['cart-drawer'];
            console.log('Cart drawer updated via section');
          }
        }
        
        // Update cart icon bubble
        if (sections['cart-icon-bubble']) {
          const bubble = document.querySelector('.cart-count-bubble, .cart-bubble');
          if (bubble) {
            bubble.outerHTML = sections['cart-icon-bubble'];
          }
        }
      })
      .catch(error => {
        console.error('Error refreshing via sections:', error);
      });
  }
  
  // Method 2: Refresh via AJAX cart HTML
  function refreshCartDrawerViaAjax() {
    return fetch('/cart')
      .then(response => response.text())
      .then(html => {
        // Parse the full cart page HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find cart items in the response
        const cartItems = doc.querySelectorAll('.cart-item, .cart__item, [data-cart-item]');
        const currentCartItems = document.querySelectorAll('.cart-drawer .cart-item, .cart-drawer .cart__item, .cart-drawer [data-cart-item]');
        
        // Update each cart item
        cartItems.forEach((newItem, index) => {
          if (currentCartItems[index]) {
            currentCartItems[index].outerHTML = newItem.outerHTML;
          }
        });
        
        console.log('Cart drawer updated via AJAX');
      })
      .catch(error => {
        console.error('Error refreshing via AJAX:', error);
      });
  }
  
  // Function to manually update cart drawer content
  function updateCartDrawerManually(cart) {
    // Update item counts in cart drawer
    const itemQuantitySelectors = [
      '.cart-item__quantity input',
      '.cart-drawer__quantity input',
      '.quantity-input',
      '[data-quantity-input]',
      '.cart-item-qty',
      '.item-quantity'
    ];
    
    itemQuantitySelectors.forEach(selector => {
      const inputs = document.querySelectorAll(selector);
      inputs.forEach((input, index) => {
        if (cart.items[index]) {
          input.value = cart.items[index].quantity;
          input.setAttribute('value', cart.items[index].quantity);
        }
      });
    });
    
    // Update total count in drawer header
    const drawerCountSelectors = [
      '.cart-drawer__header .cart-count',
      '.drawer__header .cart-count',
      '.cart-drawer-title .cart-count',
      '.cart-header .cart-count'
    ];
    
    drawerCountSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.textContent = cart.item_count;
      });
    });
    
    // Update subtotal
    const subtotalSelectors = [
      '.cart-drawer__footer .totals__subtotal-value',
      '.cart-subtotal',
      '.cart-total',
      '[data-cart-subtotal]'
    ];
    
    subtotalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.textContent = Shopify.formatMoney(cart.total_price);
      });
    });
    
    console.log('Cart drawer manually updated');
    
    // Force fix text wrapping in header
    fixCartHeaderTextWrapping();
  }
  
  // Function to fix cart header text wrapping
  function fixCartHeaderTextWrapping() {
    setTimeout(() => {
      // Fix cart header layout - keep on same line
      const headerSelectors = [
        '.cart-drawer__header',
        '.drawer__header', 
        '.cart-header'
      ];
      
      headerSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Set header as flex row (horizontal) - LEFT ALIGNED
          element.style.display = 'flex';
          element.style.flexDirection = 'row';
          element.style.alignItems = 'center';
          element.style.justifyContent = 'flex-start'; // Left align instead of space-between
          element.style.position = 'relative';
          element.style.padding = '15px 10px'; // Less padding - more left
          element.style.gap = '0'; // Remove gap between elements
          
          // Find and position close button - close to title
          const closeBtn = element.querySelector('button, .close, [aria-label*="Close"]');
          if (closeBtn) {
            closeBtn.style.position = 'static';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.zIndex = '10';
            closeBtn.style.order = '1';
            closeBtn.style.margin = '0 5px 0 0'; // Smaller margin - closer to left
            closeBtn.style.flexShrink = '0';
          }
          
          // Find and style title - close to close button
          const title = element.querySelector('h1, h2, h3, .title');
          if (title) {
            title.style.whiteSpace = 'nowrap';
            title.style.display = 'block';
            title.style.textAlign = 'left'; // Left align instead of center
            title.style.fontSize = '16px';
            title.style.margin = '0';
            title.style.order = '2';
            title.style.flexShrink = '0';
            title.style.letterSpacing = 'normal';
            title.style.wordSpacing = 'normal';
          }
        });
      });
      
      // FORCE product titles to wrap - STRONGEST METHOD
      const productTitleSelectors = [
        '.cart-item__name',
        '.cart-item__title', 
        '.cart__item-name',
        '.cart__item-title',
        '.cart-drawer__item-name',
        '.drawer__item-name',
        '.mini-cart-item__name',
        '.cart-item h3',
        '.cart-item h4',
        '.cart__item h3', 
        '.cart__item h4',
        '.cart-item a',
        '.cart__item a',
        '.cart-drawer__item a',
        '.cart-drawer .cart-item__name',
        '.cart-drawer .cart-item__title',
        '.drawer .cart-item__name',
        '.drawer .cart-item__title'
      ];
      
      // Also find elements by content matching
      const allElements = document.querySelectorAll('.cart-drawer *, .drawer *');
      const productNameElements = [];
      
      allElements.forEach(el => {
        if (el.textContent && el.textContent.includes('Electric Spin Scrubber')) {
          productNameElements.push(el);
        }
      });
      
      // Combine both selector-based and content-based elements
      const allProductElements = [
        ...document.querySelectorAll(productTitleSelectors.join(', ')),
        ...productNameElements
      ];
      
      allProductElements.forEach(element => {
        if (element && element.textContent && element.textContent.length > 20) {
          // FORCE wrapping with multiple methods
          element.style.setProperty('white-space', 'normal', 'important');
          element.style.setProperty('word-wrap', 'break-word', 'important');
          element.style.setProperty('word-break', 'break-word', 'important');
          element.style.setProperty('overflow-wrap', 'break-word', 'important');
          element.style.setProperty('line-height', '1.3', 'important');
          element.style.setProperty('max-width', '160px', 'important');
          element.style.setProperty('width', '160px', 'important');
          element.style.setProperty('font-size', '13px', 'important');
          element.style.setProperty('margin-bottom', '5px', 'important');
          element.style.setProperty('hyphens', 'auto', 'important');
          element.style.setProperty('display', 'block', 'important');
          
          // Remove any conflicting styles
          element.style.removeProperty('text-overflow');
          element.style.removeProperty('overflow');
          
          // Also apply to parent containers
          if (element.parentElement) {
            element.parentElement.style.setProperty('max-width', '160px', 'important');
            element.parentElement.style.setProperty('overflow', 'visible', 'important');
          }
        }
      });
      
      console.log('Cart header layout fixed and product titles FORCED to wrap');
      
      // Set up observer to watch for cart content changes
      setupCartContentObserver();
    }, 100);
  }
  
  // Function to setup observer for cart content changes
  function setupCartContentObserver() {
    const cartDrawer = document.querySelector('.cart-drawer, .drawer, #cart-drawer');
    if (cartDrawer) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || mutation.type === 'subtree') {
            // Re-apply product title wrapping when content changes
            setTimeout(() => {
              forceProductTitleWrapping();
            }, 50);
          }
        });
      });
      
      observer.observe(cartDrawer, {
        childList: true,
        subtree: true,
        attributes: false
      });
      
      console.log('Cart content observer setup');
    }
  }
  
  // Separate function to force product title wrapping
  function forceProductTitleWrapping() {
    // Find all possible product name elements
    const allElements = document.querySelectorAll('.cart-drawer *, .drawer *, .cart-item *, .cart__item *');
    
    allElements.forEach(element => {
      const text = element.textContent || '';
      
      // If element contains long product name, force wrapping
      if (text.includes('Electric Spin Scrubber') || 
          text.includes('Crevice Cleaning Brushes') ||
          (text.length > 25 && element.tagName && 
           ['A', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'DIV'].includes(element.tagName))) {
        
        // Apply strongest possible wrapping styles
        element.style.setProperty('white-space', 'normal', 'important');
        element.style.setProperty('word-wrap', 'break-word', 'important');
        element.style.setProperty('word-break', 'break-word', 'important');
        element.style.setProperty('overflow-wrap', 'break-word', 'important');
        element.style.setProperty('max-width', '160px', 'important');
        element.style.setProperty('width', '160px', 'important');
        element.style.setProperty('font-size', '13px', 'important');
        element.style.setProperty('line-height', '1.3', 'important');
        element.style.setProperty('display', 'block', 'important');
        
        console.log('Forced wrapping on:', text.substring(0, 30) + '...');
      }
    });
  }
  
  // Function to open cart drawer
  function openCartDrawer() {
    // Method 1: Shopify theme cart drawer
    if (window.theme && window.theme.CartDrawer && window.theme.CartDrawer.open) {
      window.theme.CartDrawer.open();
      return;
    }
    
    // Method 2: Dawn theme cart drawer
    if (window.CartDrawer && window.CartDrawer.open) {
      window.CartDrawer.open();
      return;
    }
    
    // Method 3: Common cart drawer selectors - click to trigger
    const cartDrawerTriggers = document.querySelectorAll(
      '[data-cart-drawer], .cart-drawer-toggle, .js-drawer-open-cart, .cart-link, [href="#cart-drawer"], .header__icon--cart'
    );
    
    if (cartDrawerTriggers.length > 0) {
      cartDrawerTriggers[0].click();
      return;
    }
    
    // Method 4: Dispatch custom cart events
    document.dispatchEvent(new CustomEvent('cart:open'));
    window.dispatchEvent(new CustomEvent('cart:open'));
    document.dispatchEvent(new CustomEvent('drawer:open', { detail: { drawer: 'cart' } }));
    
    // Method 5: Manually show cart drawer element
    const cartDrawer = document.querySelector(
      '.cart-drawer, .drawer, [data-drawer="cart"], #cart-drawer, .js-drawer, .mini-cart'
    );
    
    if (cartDrawer) {
      // Add open classes
      cartDrawer.classList.add('is-open', 'active', 'open', 'drawer--is-open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      cartDrawer.style.display = 'block';
      cartDrawer.style.visibility = 'visible';
      cartDrawer.style.opacity = '1';
      cartDrawer.style.transform = 'translateX(0)';
      
      // Show overlay
      const overlay = document.querySelector('.drawer-overlay, .cart-overlay, .overlay');
      if (overlay) {
        overlay.classList.add('is-open', 'active');
        overlay.style.display = 'block';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
      }
      
      // Add body class to prevent scrolling
      document.body.classList.add('drawer-open', 'cart-open', 'overflow-hidden');
    }
    
    console.log('Cart drawer opened');
  }
});

// Allow cart drawer functionality
document.addEventListener('DOMContentLoaded', function() {
  // Re-enable cart drawer links after page load
  setTimeout(() => {
    const cartLinks = document.querySelectorAll('a[href*="/cart"], [data-cart-drawer], .cart-drawer-toggle');
    cartLinks.forEach(link => {
      // Remove any blocking event listeners and allow normal cart drawer functionality
      link.style.pointerEvents = 'auto';
    });
  }, 1000);
});



