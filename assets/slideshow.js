/* Slideshow JavaScript - Extracted from slideshow.liquid */

// Initialize Swiper sliders
document.addEventListener('DOMContentLoaded', function() {
  // Find all slideshow sections
  const sliders = document.querySelectorAll('.home-slider.swiper');
  
  sliders.forEach(function(slider) {
    const sliderId = slider.id;
    const autoplayDelay = slider.dataset.autoplayDelay || 5000;
    
    new Swiper('#' + sliderId, {
      loop: true,
      autoplay: {
        delay: parseInt(autoplayDelay),
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  });
});
