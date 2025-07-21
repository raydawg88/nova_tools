// NOVA ANALYTICS - Privacy-First Analytics for Nova Products
// Tracks usage patterns, viral loops, and conversion without being creepy

class NovaAnalytics {
    constructor() {
        this.initialized = false;
        this.queue = [];
        this.config = {
            endpoint: 'https://api.nova.tools/analytics', // Future API
            flushInterval: 30000, // 30 seconds
            maxBatchSize: 50,
            storageKey: 'nova_analytics_queue',
            sessionKey: 'nova_analytics_session',
            debug: false
        };
        this.session = null;
    }
    
    init(options = {}) {
        if (this.initialized) return;
        
        this.config = { ...this.config, ...options };
        this.loadQueue();
        this.startSession();
        this.initialized = true;
        
        // Set up flush interval
        setInterval(() => this.flush(), this.config.flushInterval);
        
        // Track page views automatically
        this.page();
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.track('page_hidden');
            } else {
                this.track('page_visible');
            }
        });
        
        // Flush on page unload
        window.addEventListener('beforeunload', () => {
            this.flush(true);
        });
        
        return this;
    }
    
    startSession() {
        const existingSession = sessionStorage.getItem(this.config.sessionKey);
        
        if (existingSession) {
            this.session = JSON.parse(existingSession);
        } else {
            this.session = {
                id: this.generateId(),
                startTime: Date.now(),
                pageViews: 0,
                events: 0
            };
            sessionStorage.setItem(this.config.sessionKey, JSON.stringify(this.session));
            
            // Track new session
            this.track('session_start', {
                referrer: document.referrer,
                utm_source: this.getURLParam('utm_source'),
                utm_medium: this.getURLParam('utm_medium'),
                utm_campaign: this.getURLParam('utm_campaign')
            });
        }
    }
    
    track(eventName, properties = {}) {
        if (!this.initialized) return;
        
        const event = {
            id: this.generateId(),
            name: eventName,
            properties: {
                ...properties,
                ...this.getDefaultProperties()
            },
            timestamp: Date.now(),
            session_id: this.session.id
        };
        
        this.queue.push(event);
        this.session.events++;
        
        if (this.config.debug) {
            console.log('[Nova Analytics] Track:', event);
        }
        
        // Auto-flush if queue is getting large
        if (this.queue.length >= this.config.maxBatchSize) {
            this.flush();
        }
        
        // Save queue locally
        this.saveQueue();
    }
    
    page(name = null, properties = {}) {
        if (!this.initialized) return;
        
        const pageName = name || window.location.pathname;
        
        this.track('page_view', {
            page: pageName,
            title: document.title,
            url: window.location.href,
            ...properties
        });
        
        this.session.pageViews++;
    }
    
    identify(userId, traits = {}) {
        if (!this.initialized) return;
        
        this.track('identify', {
            user_id: userId,
            traits: traits
        });
    }
    
    // Track viral events
    viral(action, properties = {}) {
        this.track(`viral_${action}`, {
            ...properties,
            viral_action: action
        });
    }
    
    // Track conversion events
    conversion(action, value = null, properties = {}) {
        this.track(`conversion_${action}`, {
            ...properties,
            conversion_action: action,
            conversion_value: value
        });
    }
    
    // Track product-specific events
    product(productId, action, properties = {}) {
        this.track('product_event', {
            product_id: productId,
            product_action: action,
            ...properties
        });
    }
    
    // Get default properties for all events
    getDefaultProperties() {
        return {
            // Page context
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            
            // User context
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            
            // Nova context
            nova_product: this.config.productId || this.detectProduct(),
            nova_version: '1.0.0',
            
            // Session context
            session_duration: Date.now() - this.session.startTime,
            session_page_views: this.session.pageViews,
            session_events: this.session.events
        };
    }
    
    detectProduct() {
        // Try to detect product from URL
        const path = window.location.pathname;
        const match = path.match(/projects\/([^\/]+)/);
        return match ? match[1] : 'unknown';
    }
    
    getURLParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    saveQueue() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.queue));
        } catch (e) {
            console.error('[Nova Analytics] Failed to save queue:', e);
        }
    }
    
    loadQueue() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                this.queue = JSON.parse(saved);
            }
        } catch (e) {
            console.error('[Nova Analytics] Failed to load queue:', e);
        }
    }
    
    async flush(sync = false) {
        if (this.queue.length === 0) return;
        
        const events = [...this.queue];
        this.queue = [];
        this.saveQueue();
        
        if (this.config.debug) {
            console.log('[Nova Analytics] Flushing', events.length, 'events');
        }
        
        try {
            // In production, this would send to API
            if (sync) {
                // Use sendBeacon for reliable delivery on page unload
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(this.config.endpoint, JSON.stringify(events));
                }
            } else {
                // Regular async post
                // await fetch(this.config.endpoint, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(events)
                // });
            }
            
            // For now, just log to console in debug mode
            if (this.config.debug) {
                console.log('[Nova Analytics] Events flushed:', events);
            }
        } catch (e) {
            // Re-queue events on failure
            this.queue = [...events, ...this.queue];
            this.saveQueue();
            console.error('[Nova Analytics] Flush failed:', e);
        }
    }
    
    // Utility methods for common tracking patterns
    
    trackTiming(category, variable, time) {
        this.track('timing', {
            timing_category: category,
            timing_variable: variable,
            timing_value: time
        });
    }
    
    trackError(error, fatal = false) {
        this.track('error', {
            error_message: error.message || error,
            error_stack: error.stack,
            error_fatal: fatal
        });
    }
    
    trackSearch(query, results = null) {
        this.track('search', {
            search_query: query,
            search_results: results
        });
    }
    
    trackShare(platform, content = null) {
        this.viral('share', {
            share_platform: platform,
            share_content: content
        });
    }
    
    trackSignup(method) {
        this.conversion('signup', null, {
            signup_method: method
        });
    }
    
    trackPurchase(amount, product = null) {
        this.conversion('purchase', amount, {
            purchase_product: product
        });
    }
    
    // A/B Testing support
    experiment(experimentId, variant) {
        this.track('experiment', {
            experiment_id: experimentId,
            experiment_variant: variant
        });
        
        // Store for consistent experience
        localStorage.setItem(`nova_exp_${experimentId}`, variant);
    }
    
    getExperiment(experimentId, variants = ['control', 'variant']) {
        // Check if user already has a variant
        const stored = localStorage.getItem(`nova_exp_${experimentId}`);
        if (stored) return stored;
        
        // Assign random variant
        const variant = variants[Math.floor(Math.random() * variants.length)];
        this.experiment(experimentId, variant);
        
        return variant;
    }
}

// Initialize global instance
window.NovaAnalytics = new NovaAnalytics();

// Auto-init on products that include this script
document.addEventListener('DOMContentLoaded', () => {
    const script = document.currentScript;
    if (script && script.dataset.autoInit !== 'false') {
        const productId = script.dataset.product || window.location.pathname.split('/')[2];
        window.NovaAnalytics.init({ 
            productId,
            debug: script.dataset.debug === 'true'
        });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaAnalytics;
}