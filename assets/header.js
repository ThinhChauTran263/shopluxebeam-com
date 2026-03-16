/* Header JavaScript - Extracted from header.liquid */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-toggle-luxe');
  const mobileMenu = document.querySelector('.mobile-menu-luxe');
  
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
});
