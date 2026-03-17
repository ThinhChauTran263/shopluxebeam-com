// Cart Drawer JavaScript
(function() {
  console.log('Cart drawer loading...');
  
  function init() {
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-drawer-overlay');
    const cartClose = document.querySelector('.cart-drawer-close');
    
    if (!cartDrawer) {
      console.error('Cart drawer not found!');
      return;
    }
    
    function formatMoney(cents) {
      if (typeof cents !== 'number' || isNaN(cents)) {
        return '$0.00';
      }
      return '$' + (cents / 100).toFixed(2);
    }
    
    function openCart() {
      console.log('Opening cart...');
      fetch('/cart.js')
        .then(r => r.json())
        .then(data => {
          console.log('Cart data:', data);
          const count = document.querySelector('.cart-drawer-title .cart-count');
          if (count) count.textContent = data.item_count;
          const subtotal = document.querySelector('.cart-subtotal-price');
          if (subtotal) subtotal.textContent = formatMoney(data.total_price);
          
          // Update header cart count
          const headerCartCount = document.querySelector('.cart-count-luxe');
          if (headerCartCount) {
            headerCartCount.textContent = '(' + data.item_count + ')';
          }
          
          const itemsContainer = document.querySelector('.cart-drawer-items');
          const footer = document.querySelector('.cart-drawer-footer');
          if (data.items.length > 0) {
            let itemsHTML = '';
            data.items.forEach((item, index) => {
              const line = index + 1;
              const lineTotal = item.final_line_price;
              itemsHTML += `<div class="cart-drawer-item" data-line="${line}">
                <div class="cart-item-image">
                  ${item.image ? `<img src="${item.image}" alt="${item.title}" width="100" height="100">` : ''}
                </div>
                <div class="cart-item-details">
                  <div class="cart-item-title-row">
                    <h3 class="cart-item-title">${item.product_title}</h3>
                    <div class="cart-item-total">${formatMoney(lineTotal)}</div>
                  </div>
                  <div class="cart-item-price-qty">
                    <span class="cart-item-quantity">${item.quantity}×</span>
                    <span class="cart-item-price">${formatMoney(item.final_price)}</span>
                  </div>
                  <div class="cart-item-controls">
                    <div class="quantity-selector">
                      <button class="qty-btn qty-minus" data-line="${line}">−</button>
                      <input type="number" class="qty-input" value="${item.quantity}" data-line="${line}">
                      <button class="qty-btn qty-plus" data-line="${line}">+</button>
                    </div>
                    <button class="cart-item-remove" data-line="${line}">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>`;
            });
            if (itemsContainer) itemsContainer.innerHTML = itemsHTML;
            if (footer) footer.style.display = 'block';
          } else {
            if (itemsContainer) itemsContainer.innerHTML = '<div class="cart-drawer-empty"><p>No products in the cart.</p></div>';
            if (footer) footer.style.display = 'none';
          }
          cartDrawer.classList.add('active');
          if (cartOverlay) cartOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        })
        .catch(err => {
          console.error('Error fetching cart:', err);
          cartDrawer.classList.add('active');
          if (cartOverlay) cartOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
    }
    
    // Expose openCart to global scope
    window.openCartDrawer = openCart;
    
    function closeCart() {
      cartDrawer.classList.remove('active');
      if (cartOverlay) cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    function showToast(message, type) {
      const existingToast = document.querySelector('.custom-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.className = 'custom-toast custom-toast-' + type;
      
      let icon = '';
      if (type === 'error') {
        icon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      } else if (type === 'success') {
        icon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      }
      
      toast.innerHTML = '<div class="custom-toast-icon">' + icon + '</div><div class="custom-toast-message">' + message + '</div>';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('custom-toast-show'), 10);
      setTimeout(() => {
        toast.classList.remove('custom-toast-show');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
    
    function updateCart(line, qty) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line, quantity: qty })
      })
      .then(r => {
        if (!r.ok) {
          console.error('Cart update failed:', r.status, r.statusText);
          return r.text().then(text => {
            console.error('Error response:', text);
            let errorData;
            try {
              errorData = JSON.parse(text);
            } catch(e) {
              errorData = { message: 'Failed to update cart' };
            }
            throw errorData;
          });
        }
        return r.json();
      })
      .then(data => {
        console.log('Cart updated successfully:', data);
        const count = document.querySelector('.cart-drawer-title .cart-count');
        if (count) count.textContent = data.item_count;
        const subtotal = document.querySelector('.cart-subtotal-price');
        if (subtotal) subtotal.textContent = formatMoney(data.total_price);
        const headerCartCount = document.querySelector('.cart-count-luxe');
        if (headerCartCount) {
          headerCartCount.textContent = '(' + data.item_count + ')';
        }
        const itemsContainer = document.querySelector('.cart-drawer-items');
        const footer = document.querySelector('.cart-drawer-footer');
        if (data.items.length > 0) {
          let itemsHTML = '';
          data.items.forEach((item, index) => {
            const itemLine = index + 1;
            const lineTotal = item.final_line_price;
            itemsHTML += `<div class="cart-drawer-item" data-line="${itemLine}">
              <div class="cart-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" width="100" height="100">` : ''}
              </div>
              <div class="cart-item-details">
                <h3 class="cart-item-title">${item.product_title}</h3>
                <div class="cart-item-price-qty">
                  <span class="cart-item-quantity">${item.quantity}×</span>
                  <span class="cart-item-price">${formatMoney(item.final_price)}</span>
                </div>
                <div class="cart-item-controls">
                  <div class="quantity-selector">
                    <button class="qty-btn qty-minus" data-line="${itemLine}">−</button>
                    <input type="number" class="qty-input" value="${item.quantity}" data-line="${itemLine}">
                    <button class="qty-btn qty-plus" data-line="${itemLine}">+</button>
                  </div>
                  <button class="cart-item-remove" data-line="${itemLine}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="cart-item-total">
                ${formatMoney(lineTotal)}
              </div>
            </div>`;
          });
          if (itemsContainer) itemsContainer.innerHTML = itemsHTML;
          if (footer) footer.style.display = 'block';
        } else {
          if (itemsContainer) itemsContainer.innerHTML = '<div class="cart-drawer-empty"><p>No products in the cart.</p></div>';
          if (footer) footer.style.display = 'none';
        }
      })
      .catch(err => {
        console.error('Error updating cart:', err);
        showToast('Maximum available quantity reached', 'error');
        fetch('/cart.js')
          .then(r => r.json())
          .then(data => {
            console.log('Reloaded cart after error:', data);
            const count = document.querySelector('.cart-drawer-title .cart-count');
            if (count) count.textContent = data.item_count;
            const subtotal = document.querySelector('.cart-subtotal-price');
            if (subtotal) subtotal.textContent = formatMoney(data.total_price);
            const headerCartCount = document.querySelector('.cart-count-luxe');
            if (headerCartCount) {
              headerCartCount.textContent = '(' + data.item_count + ')';
            }
            rebuildCartItems(data);
          });
      });
    }
    
    function rebuildCartItems(data) {
      const itemsContainer = document.querySelector('.cart-drawer-items');
      const footer = document.querySelector('.cart-drawer-footer');
      if (data.items.length > 0) {
        let itemsHTML = '';
        data.items.forEach((item, index) => {
          const itemLine = index + 1;
          const lineTotal = item.final_line_price;
          itemsHTML += `<div class="cart-drawer-item" data-line="${itemLine}">
            <div class="cart-item-image">
              ${item.image ? `<img src="${item.image}" alt="${item.title}" width="100" height="100">` : ''}
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title-row">
                <h3 class="cart-item-title">${item.product_title}</h3>
                <div class="cart-item-total">${formatMoney(lineTotal)}</div>
              </div>
              <div class="cart-item-price-qty">
                <span class="cart-item-quantity">${item.quantity}×</span>
                <span class="cart-item-price">${formatMoney(item.final_price)}</span>
              </div>
              <div class="cart-item-controls">
                <div class="quantity-selector">
                  <button class="qty-btn qty-minus" data-line="${itemLine}">−</button>
                  <input type="number" class="qty-input" value="${item.quantity}" data-line="${itemLine}">
                  <button class="qty-btn qty-plus" data-line="${itemLine}">+</button>
                </div>
                <button class="cart-item-remove" data-line="${itemLine}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>`;
        });
        if (itemsContainer) itemsContainer.innerHTML = itemsHTML;
        if (footer) footer.style.display = 'block';
      } else {
        if (itemsContainer) itemsContainer.innerHTML = '<div class="cart-drawer-empty"><p>No products in the cart.</p></div>';
        if (footer) footer.style.display = 'none';
      }
    }
    
    // Event listeners
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    // Listen for cart:updated event from add to cart button
    document.addEventListener('cart:updated', function(e) {
      console.log('Cart updated event received:', e.detail);
      openCart();
    });
    
    document.addEventListener('click', function(e) {
      // Open cart drawer when clicking cart link in header
      if (e.target.closest('.cart-link-luxe, .cart-icon-luxe')) {
        e.preventDefault();
        openCart();
        return;
      }
      
      if (e.target.matches('.qty-plus')) {
        const line = parseInt(e.target.dataset.line);
        const input = document.querySelector('.qty-input[data-line="' + line + '"]');
        if (input) {
          const newQty = parseInt(input.value) + 1;
          updateCart(line, newQty);
        }
      }
      
      if (e.target.matches('.qty-minus')) {
        const line = parseInt(e.target.dataset.line);
        const input = document.querySelector('.qty-input[data-line="' + line + '"]');
        if (input && parseInt(input.value) > 1) {
          const newQty = parseInt(input.value) - 1;
          updateCart(line, newQty);
        }
      }
      
      if (e.target.matches('.cart-item-remove, .cart-item-remove *')) {
        const btn = e.target.closest('.cart-item-remove');
        if (btn) {
          const line = parseInt(btn.dataset.line);
          updateCart(line, 0);
        }
      }
    });
    
    document.addEventListener('change', function(e) {
      if (e.target.matches('.qty-input')) {
        const line = parseInt(e.target.dataset.line);
        const newQty = Math.max(0, parseInt(e.target.value) || 0);
        updateCart(line, newQty);
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
