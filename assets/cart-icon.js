// Cart Icon Component
class CartIcon extends HTMLElement {
  constructor() {
    super();
    this.cartBubble = this.querySelector('[ref="cartBubble"]');
    this.cartBubbleText = this.querySelector('[ref="cartBubbleText"]');
    this.cartBubbleCount = this.querySelector('[ref="cartBubbleCount"]');
  }

  connectedCallback() {
    // Listen for cart updates
    document.addEventListener('cart:updated', this.updateCartCount.bind(this));
  }

  updateCartCount(event) {
    if (event.detail && typeof event.detail.item_count !== 'undefined') {
      const itemCount = event.detail.item_count;
      
      if (this.cartBubbleCount) {
        this.cartBubbleCount.textContent = itemCount;
        
        if (itemCount === 0) {
          this.cartBubbleCount.classList.add('hidden');
          this.cartBubble?.classList.add('visually-hidden');
        } else {
          this.cartBubbleCount.classList.remove('hidden');
          this.cartBubble?.classList.remove('visually-hidden');
        }
      }

      // Update accessibility text
      if (this.cartBubbleText) {
        const accessibilityText = this.cartBubbleText.querySelector('.visually-hidden');
        if (accessibilityText) {
          accessibilityText.textContent = `Cart count: ${itemCount}`;
        }
      }

      // Add animation class
      if (this.cartBubble) {
        this.cartBubble.classList.add('cart-bubble--animating');
        setTimeout(() => {
          this.cartBubble.classList.remove('cart-bubble--animating');
        }, 300);
      }
    }
  }
}

customElements.define('cart-icon', CartIcon);