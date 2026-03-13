/**
 * LuxeBeam Theme Utilities
 * Core JavaScript utilities for the LuxeBeam Shopify theme
 */

/**
 * Request an idle callback or fallback to setTimeout
 * @returns {function} The requestIdleCallback function
 */
export const requestIdleCallback =
  typeof window.requestIdleCallback == 'function' ? window.requestIdleCallback : setTimeout;

/**
 * Returns a promise that resolves after yielding to the main thread.
 * @see https://web.dev/articles/optimize-long-tasks#scheduler-yield
 */
export const yieldToMainThread = () => {
  if ('yield' in scheduler) {
    // @ts-ignore - TypeScript doesn't recognize the yield method yet.
    return scheduler.yield();
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
};

/**
 * Tells if we are on a low power device based on the number of CPU cores and RAM
 * @returns {boolean} True if the device is a low power device, false otherwise
 */
export function isLowPowerDevice() {
  return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
}

/**
 * Check if the browser supports View Transitions API
 * @returns {boolean} True if the browser supports View Transitions API, false otherwise
 */
export function supportsViewTransitions() {
  return typeof document.startViewTransition === 'function';
}

/**
 * The current view transition
 * @type {{ current: Promise<void> | undefined }}
 */
export const viewTransition = {
  current: undefined,
};

/**
 * LuxeBeam theme initialization
 */
export function initLuxeBeamTheme() {
  // Set LuxeBeam brand colors as CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--luxebeam-primary', '#ff6b35');
  root.style.setProperty('--luxebeam-secondary', '#ff8c42');
  root.style.setProperty('--luxebeam-dark', '#0a0a0a');
  
  // Initialize lighting effects
  initLightingEffects();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
}

/**
 * Initialize lighting effects for LuxeBeam products
 */
export function initLightingEffects() {
  const glowElements = document.querySelectorAll('.luxebeam-glow');
  
  glowElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transition = 'box-shadow 0.3s ease';
    });
  });
}

/**
 * Initialize smooth scrolling behavior
 */
export function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format price for display
 * @param {number} price - Price in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price / 100);
}

/**
 * Initialize LuxeBeam theme when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLuxeBeamTheme);
} else {
  initLuxeBeamTheme();
}