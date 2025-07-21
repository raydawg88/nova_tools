// Simple Analytics for Nova Tools - Privacy-first, no cookies
(function() {
    const ANALYTICS_KEY = 'nova_analytics_events';
    const SESSION_KEY = 'nova_session';
    const ANALYTICS_URL = 'https://api.counterapi.dev/v1/nova-tools';
    
    // Generate or get session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }
    
    // Track event
    window.trackEvent = function(eventName, properties = {}) {
        try {
            const event = {
                name: eventName,
                properties: properties,
                timestamp: Date.now(),
                session: getSessionId(),
                page: window.location.pathname,
                referrer: document.referrer,
                product: window.location.pathname.split('/').filter(Boolean).pop() || 'home'
            };
            
            // Store locally
            const events = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
            events.push(event);
            if (events.length > 100) events.shift(); // Keep last 100 events
            localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
            
            // Send to counter API (free, no auth needed)
            fetch(`${ANALYTICS_URL}/${eventName}/up`).catch(() => {});
            
            // Log in development
            if (window.location.hostname === 'localhost') {
                console.log('📊 Event tracked:', eventName, properties);
            }
        } catch (e) {
            // Silent fail - never break the app for analytics
        }
    };
    
    // Auto-track page views
    window.trackEvent('page_view', {
        title: document.title,
        path: window.location.pathname
    });
    
    // Track clicks on CTAs
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, a');
        if (target) {
            const text = target.textContent.trim();
            if (text && !target.closest('nav')) {
                window.trackEvent('click', {
                    element: target.tagName.toLowerCase(),
                    text: text.substring(0, 50)
                });
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (timeOnPage > 3) { // Only track if more than 3 seconds
            window.trackEvent('time_on_page', { seconds: timeOnPage });
        }
    });
    
    // Expose analytics data for dashboard
    window.getAnalyticsData = function() {
        return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    };
})();