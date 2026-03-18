/**
 * Global Error Handler for LuxeBeam Theme
 * Handles JavaScript errors gracefully
 */

(function() {
    'use strict';
    
    // Global error handler
    window.addEventListener('error', function(event) {
        console.warn('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // Don't let errors break the page
        return true;
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('Unhandled Promise Rejection:', event.reason);
        
        // Prevent the default handling (which would log to console)
        event.preventDefault();
    });
    
    // Safe console logging
    window.safeLog = function(message, data) {
        if (typeof console !== 'undefined' && console.log) {
            console.log(message, data);
        }
    };
    
    // Safe localStorage access
    window.safeStorage = {
        getItem: function(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage access denied:', e);
                return null;
            }
        },
        
        setItem: function(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('localStorage write denied:', e);
                return false;
            }
        },
        
        removeItem: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('localStorage remove denied:', e);
                return false;
            }
        }
    };
    
    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('theme-error-handler-loaded');
    }
    
    safeLog('LuxeBeam Error Handler initialized');
    
})();