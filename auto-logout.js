// Auto logout after 30 seconds of inactivity
(function() {
    'use strict';
    
    const INACTIVITY_TIMEOUT = 30000; // 30 seconds
    let inactivityTimer;
    
    function logout() {
        console.log('Auto logout triggered due to inactivity');
        
        // Clear all storage
        try {
            sessionStorage.clear();
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing storage:', e);
        }
        
        // Clear cookies if any
        try {
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=; expires=" + new Date(0).toUTCString() + "; path=/");
            });
        } catch (e) {
            console.error('Error clearing cookies:', e);
        }
        
        // Optional: Call logout API
        // fetch('/api/logout', { method: 'POST', credentials: 'include' })
        //     .finally(() => {
        //         window.location.href = 'index.html';
        //     });
        
        // Simple redirect
        window.location.href = 'index.html';
    }
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
    }
    
    // Track user activity
    const activityEvents = [
        'mousedown', 'mousemove', 'keydown', 'scroll', 
        'click', 'touchstart', 'touchmove', 'wheel'
    ];
    
    activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    window.addEventListener('focus', resetInactivityTimer);
    window.addEventListener('load', resetInactivityTimer);
    
    // Initial start
    resetInactivityTimer();
    
    // For debugging - remove in production
    console.log('✅ Auto logout active: 30 seconds of inactivity');
    
    // Show remaining time in console every second (optional, remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        let secondsLeft = INACTIVITY_TIMEOUT / 1000;
        setInterval(() => {
            secondsLeft--;
            if (secondsLeft < 0) secondsLeft = INACTIVITY_TIMEOUT / 1000;
            console.log(`⏱️ Auto logout in: ${secondsLeft}s`);
        }, 1000);
    }
})();