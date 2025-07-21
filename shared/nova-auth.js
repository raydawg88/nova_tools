// NOVA AUTH SYSTEM - Universal Authentication for Nova Products
// 1980s/1990s Terminal Aesthetic

class NovaAuth {
    constructor() {
        this.initialized = false;
        this.currentUser = null;
        this.config = {
            storageKey: 'nova_auth_session',
            apiEndpoint: 'https://api.nova.tools/auth', // Future API
            providers: ['google', 'github', 'email'],
            productId: null
        };
    }
    
    init(options = {}) {
        if (this.initialized) return;
        
        this.config = { ...this.config, ...options };
        this.loadSession();
        this.initialized = true;
        
        // Add auth UI to page
        this.injectAuthUI();
        
        return this;
    }
    
    loadSession() {
        try {
            const sessionData = localStorage.getItem(this.config.storageKey);
            if (sessionData) {
                this.currentUser = JSON.parse(sessionData);
                this.onAuthStateChanged(this.currentUser);
            }
        } catch (e) {
            console.error('Failed to load session:', e);
        }
    }
    
    saveSession(user) {
        this.currentUser = user;
        localStorage.setItem(this.config.storageKey, JSON.stringify(user));
        this.onAuthStateChanged(user);
    }
    
    clearSession() {
        this.currentUser = null;
        localStorage.removeItem(this.config.storageKey);
        this.onAuthStateChanged(null);
    }
    
    // Inject retro auth UI
    injectAuthUI() {
        // Add auth status to header if not exists
        if (!document.getElementById('nova-auth-status')) {
            const authStatus = document.createElement('div');
            authStatus.id = 'nova-auth-status';
            authStatus.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'VT323', monospace;
                color: #00ff00;
                background: #000;
                border: 2px solid #00ff00;
                padding: 10px 20px;
                cursor: pointer;
                text-shadow: 0 0 5px #00ff00;
            `;
            
            authStatus.onclick = () => this.showAuthModal();
            document.body.appendChild(authStatus);
            
            this.updateAuthUI();
        }
    }
    
    updateAuthUI() {
        const authStatus = document.getElementById('nova-auth-status');
        if (!authStatus) return;
        
        if (this.currentUser) {
            authStatus.innerHTML = `
                <span style="color: #00ff00;">▶</span> ${this.currentUser.email || 'USER'} 
                <span style="color: #ff0080; margin-left: 10px;">◀</span>
            `;
        } else {
            authStatus.innerHTML = '[ LOGIN ]';
        }
    }
    
    showAuthModal() {
        if (this.currentUser) {
            this.showUserMenu();
        } else {
            this.showLoginModal();
        }
    }
    
    showLoginModal() {
        // Use RetroUI if available, fallback to basic modal
        const modalContent = `
            <div style="text-align: center;">
                <div class="retro-ascii-header" style="font-size: 10px; line-height: 1; margin-bottom: 20px;">
 █▄ █ █▀█ █ █ ▄▀█   ▄▀█ █ █ ▀█▀ █ █
 █ ▀█ █▄█ ▀▄▀ █▀█   █▀█ █▄█  █  █▀█
                </div>
                
                <p style="color: #00ff00; margin-bottom: 30px;">AUTHENTICATION REQUIRED</p>
                
                <div style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto;">
                    <button class="retro-button" onclick="NovaAuth.login('google')" style="width: 100%;">
                        [ LOGIN WITH GOOGLE ]
                    </button>
                    <button class="retro-button" onclick="NovaAuth.login('github')" style="width: 100%;">
                        [ LOGIN WITH GITHUB ]
                    </button>
                    <button class="retro-button" onclick="NovaAuth.login('email')" style="width: 100%;">
                        [ EMAIL MAGIC LINK ]
                    </button>
                </div>
                
                <p style="color: #00ffff; margin-top: 30px; font-size: 14px;">
                    One account for all Nova products
                </p>
            </div>
        `;
        
        if (window.Retro && window.Retro.showModal) {
            window.Retro.showModal({
                title: 'NOVA AUTHENTICATION',
                content: modalContent,
                buttons: [
                    { text: 'CANCEL', action: () => window.Retro.closeModal() }
                ]
            });
        } else {
            // Fallback modal
            this.showBasicModal('NOVA AUTH', modalContent);
        }
    }
    
    showUserMenu() {
        const stats = this.getUserStats();
        const menuContent = `
            <div style="text-align: center;">
                <p style="color: #00ff00; font-size: 20px; margin-bottom: 20px;">
                    USER: ${this.currentUser.email || 'ANONYMOUS'}
                </p>
                
                <div style="background: #111; border: 1px solid #00ff00; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #00ffff; margin-bottom: 15px;">[ NOVA STATS ]</h3>
                    <p>Products Used: <span style="color: #00ff00;">${stats.productsUsed}</span></p>
                    <p>Total Saved: <span style="color: #00ff00;">$${stats.totalSaved}</span></p>
                    <p>Member Since: <span style="color: #00ff00;">${stats.memberSince}</span></p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto;">
                    <button class="retro-button retro-cyan" onclick="NovaAuth.showProducts()" style="width: 100%;">
                        [ VIEW ALL PRODUCTS ]
                    </button>
                    <button class="retro-button retro-amber" onclick="NovaAuth.showSettings()" style="width: 100%;">
                        [ SETTINGS ]
                    </button>
                    <button class="retro-button retro-pink" onclick="NovaAuth.logout()" style="width: 100%;">
                        [ LOGOUT ]
                    </button>
                </div>
            </div>
        `;
        
        if (window.Retro && window.Retro.showModal) {
            window.Retro.showModal({
                title: 'NOVA ACCOUNT',
                content: menuContent,
                buttons: []
            });
        } else {
            this.showBasicModal('NOVA ACCOUNT', menuContent);
        }
    }
    
    // Mock authentication (in production, would hit API)
    async login(provider) {
        if (window.Retro) window.Retro.showToast(`Connecting to ${provider}...`);
        
        // Simulate auth delay
        setTimeout(() => {
            // Mock user data
            const mockUser = {
                id: `nova_user_${Date.now()}`,
                email: `user@${provider}.com`,
                provider: provider,
                createdAt: new Date().toISOString(),
                products: {}
            };
            
            this.saveSession(mockUser);
            
            if (window.Retro) {
                window.Retro.closeModal();
                window.Retro.showToast('Authentication successful!');
            }
            
            // Track login
            if (window.NovaAnalytics) {
                window.NovaAnalytics.track('user_login', {
                    provider: provider,
                    product: this.config.productId
                });
            }
        }, 1500);
    }
    
    logout() {
        this.clearSession();
        if (window.Retro) {
            window.Retro.closeModal();
            window.Retro.showToast('Logged out successfully');
        }
    }
    
    // Get current user
    getUser() {
        return this.currentUser;
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
    
    // Auth state change callback
    onAuthStateChanged(user) {
        this.updateAuthUI();
        
        // Notify all listeners
        window.dispatchEvent(new CustomEvent('nova-auth-changed', {
            detail: { user }
        }));
    }
    
    // Get user stats across products
    getUserStats() {
        if (!this.currentUser) return null;
        
        // Aggregate stats from localStorage
        const stats = {
            productsUsed: 0,
            totalSaved: 0,
            memberSince: new Date(this.currentUser.createdAt).toLocaleDateString()
        };
        
        // Check each product's data
        const products = ['cancelbot', 'meeting-escape', 'passive-aggressive', 'performance-review'];
        products.forEach(product => {
            const productData = localStorage.getItem(`nova_${product}_data`);
            if (productData) {
                stats.productsUsed++;
                // Add product-specific savings
            }
        });
        
        return stats;
    }
    
    // Save product-specific data
    saveProductData(productId, data) {
        if (!this.currentUser) return;
        
        const key = `nova_${productId}_data`;
        const existingData = JSON.parse(localStorage.getItem(key) || '{}');
        const updatedData = { ...existingData, ...data, userId: this.currentUser.id };
        
        localStorage.setItem(key, JSON.stringify(updatedData));
    }
    
    // Get product-specific data
    getProductData(productId) {
        if (!this.currentUser) return null;
        
        const key = `nova_${productId}_data`;
        return JSON.parse(localStorage.getItem(key) || '{}');
    }
    
    // Show all Nova products
    showProducts() {
        window.location.href = 'https://nova.tools/products';
    }
    
    // Show settings
    showSettings() {
        if (window.Retro) {
            window.Retro.showToast('Settings coming soon!');
        }
    }
    
    // Basic modal fallback
    showBasicModal(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            border: 3px solid #00ff00;
            padding: 30px;
            z-index: 10000;
            font-family: monospace;
            color: #00ff00;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        `;
        
        modal.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">${title}</h2>
            ${content}
            <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: #ff0080; font-size: 24px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(modal);
    }
}

// Initialize global instance
window.NovaAuth = new NovaAuth();

// Auto-init on products that include this script
document.addEventListener('DOMContentLoaded', () => {
    // Check if product wants auto-init
    const script = document.currentScript;
    if (script && script.dataset.autoInit !== 'false') {
        const productId = script.dataset.product || window.location.pathname.split('/')[1];
        window.NovaAuth.init({ productId });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaAuth;
}