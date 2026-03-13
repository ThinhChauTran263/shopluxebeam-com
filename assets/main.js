/**
 * LuxeBeam Theme - Main JavaScript
 */

(function($) {
    'use strict';

    // Document Ready
    $(document).ready(function() {
        
        // Initialize theme
        initTheme();
        
        // Mobile menu toggle
        initMobileMenu();
        
        // Product functionality
        initProductFeatures();
        
        // Cart functionality
        initCartFeatures();
        
        // Search functionality
        initSearchFeatures();
        
    });

    // Initialize theme
    function initTheme() {
        console.log('LuxeBeam Theme Loaded');
        
        // Remove loading class
        $('body').removeClass('loading');
        
        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            var target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 100
                }, 1000);
            }
        });
    }

    // Mobile menu
    function initMobileMenu() {
        $('.mobile-menu-toggle').on('click', function() {
            $('.nav-menu').toggleClass('active');
            $(this).toggleClass('active');
        });
    }

    // Product features
    function initProductFeatures() {
        
        // Product image gallery
        $('.product-image-thumb').on('click', function() {
            var newSrc = $(this).data('image');
            $('.product-main-image img').attr('src', newSrc);
            $('.product-image-thumb').removeClass('active');
            $(this).addClass('active');
        });
        
        // Quantity buttons
        $('.quantity-btn').on('click', function() {
            var input = $(this).siblings('input[type="number"]');
            var currentVal = parseInt(input.val());
            
            if ($(this).hasClass('quantity-plus')) {
                input.val(currentVal + 1);
            } else if ($(this).hasClass('quantity-minus') && currentVal > 1) {
                input.val(currentVal - 1);
            }
        });
        
        // Add to cart
        $('.add-to-cart-btn').on('click', function(e) {
            e.preventDefault();
            
            var $btn = $(this);
            var $form = $btn.closest('form');
            
            // Show loading state
            $btn.addClass('loading').text('Adding...');
            
            // Submit form via AJAX
            $.ajax({
                type: 'POST',
                url: '/cart/add.js',
                data: $form.serialize(),
                dataType: 'json',
                success: function(item) {
                    $btn.removeClass('loading').text('Added to Cart');
                    
                    // Update cart count
                    updateCartCount();
                    
                    // Show success message
                    showNotification('Product added to cart!', 'success');
                    
                    // Reset button after 2 seconds
                    setTimeout(function() {
                        $btn.text('Add to Cart');
                    }, 2000);
                },
                error: function(xhr) {
                    $btn.removeClass('loading').text('Add to Cart');
                    var error = JSON.parse(xhr.responseText);
                    showNotification(error.message || 'Error adding to cart', 'error');
                }
            });
        });
    }

    // Cart features
    function initCartFeatures() {
        
        // Update cart count on page load
        updateCartCount();
        
        // Cart quantity update
        $('.cart-quantity-input').on('change', function() {
            var $input = $(this);
            var line = $input.data('line');
            var quantity = parseInt($input.val());
            
            updateCartItem(line, quantity);
        });
        
        // Remove cart item
        $('.cart-remove-btn').on('click', function(e) {
            e.preventDefault();
            var line = $(this).data('line');
            updateCartItem(line, 0);
        });
    }

    // Search features
    function initSearchFeatures() {
        
        // Search input focus
        $('.search-input').on('focus', function() {
            $(this).closest('.search-form').addClass('focused');
        }).on('blur', function() {
            $(this).closest('.search-form').removeClass('focused');
        });
        
        // Predictive search (basic implementation)
        var searchTimeout;
        $('.search-input').on('input', function() {
            var query = $(this).val();
            
            clearTimeout(searchTimeout);
            
            if (query.length > 2) {
                searchTimeout = setTimeout(function() {
                    // Implement predictive search here
                    console.log('Searching for:', query);
                }, 300);
            }
        });
    }

    // Update cart count
    function updateCartCount() {
        $.get('/cart.js', function(cart) {
            $('.cart-count').text(cart.item_count);
        });
    }

    // Update cart item
    function updateCartItem(line, quantity) {
        $.ajax({
            type: 'POST',
            url: '/cart/change.js',
            data: {
                line: line,
                quantity: quantity
            },
            dataType: 'json',
            success: function(cart) {
                // Reload page to update cart
                location.reload();
            },
            error: function(xhr) {
                var error = JSON.parse(xhr.responseText);
                showNotification(error.message || 'Error updating cart', 'error');
            }
        });
    }

    // Show notification
    function showNotification(message, type) {
        var $notification = $('<div class="notification notification-' + type + '">' + message + '</div>');
        
        $('body').append($notification);
        
        setTimeout(function() {
            $notification.addClass('show');
        }, 100);
        
        setTimeout(function() {
            $notification.removeClass('show');
            setTimeout(function() {
                $notification.remove();
            }, 300);
        }, 3000);
    }

})(jQuery);