// NOVA SHARE WIDGET - Viral Sharing Mechanics for Nova Products
// Retro terminal aesthetic with platform-optimized messages

class NovaShare {
    constructor() {
        this.initialized = false;
        this.config = {
            platforms: ['twitter', 'linkedin', 'reddit', 'hackernews', 'facebook'],
            baseUrl: 'https://nova.tools',
            defaultHashtags: ['NovaTools', 'ProductivityHack'],
            retro: true
        };
    }
    
    init(options = {}) {
        if (this.initialized) return;
        
        this.config = { ...this.config, ...options };
        this.initialized = true;
        
        // Inject share button styles
        this.injectStyles();
        
        return this;
    }
    
    injectStyles() {
        if (document.getElementById('nova-share-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'nova-share-styles';
        styles.textContent = `
            .nova-share-widget {
                position: fixed;
                bottom: 80px;
                right: 30px;
                z-index: 999;
            }
            
            .nova-share-button {
                width: 60px;
                height: 60px;
                background: var(--retro-green, #00ff00);
                border: 3px solid #000;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #000;
                transition: all 0.3s ease;
                box-shadow: 0 5px 20px rgba(0, 255, 0, 0.5);
            }
            
            .nova-share-button:hover {
                transform: scale(1.1) rotate(15deg);
                box-shadow: 0 8px 30px rgba(0, 255, 0, 0.8);
            }
            
            .nova-share-menu {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: #000;
                border: 2px solid var(--retro-green, #00ff00);
                padding: 20px;
                display: none;
                min-width: 200px;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            }
            
            .nova-share-menu.show {
                display: block;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .nova-share-platform {
                display: block;
                padding: 10px 15px;
                margin: 5px 0;
                background: transparent;
                border: 1px solid var(--retro-green, #00ff00);
                color: var(--retro-green, #00ff00);
                text-decoration: none;
                font-family: monospace;
                font-size: 14px;
                transition: all 0.2s ease;
                cursor: pointer;
            }
            
            .nova-share-platform:hover {
                background: var(--retro-green, #00ff00);
                color: #000;
                transform: translateX(5px);
            }
            
            .nova-share-platform::before {
                content: '> ';
            }
            
            .nova-share-stats {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--retro-green, #00ff00);
                font-size: 12px;
                color: var(--retro-green, #00ff00);
                text-align: center;
            }
            
            .nova-share-close {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                color: var(--retro-green, #00ff00);
                font-size: 20px;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    create(options = {}) {
        const {
            title = document.title,
            text = '',
            url = window.location.href,
            hashtags = this.config.defaultHashtags,
            stats = null
        } = options;
        
        // Create widget container
        const widget = document.createElement('div');
        widget.className = 'nova-share-widget';
        widget.id = 'nova-share-widget';
        
        // Create share button
        const button = document.createElement('div');
        button.className = 'nova-share-button';
        button.innerHTML = '📢';
        button.onclick = () => this.toggleMenu();
        
        // Create share menu
        const menu = document.createElement('div');
        menu.className = 'nova-share-menu';
        menu.id = 'nova-share-menu';
        
        // Add close button
        const close = document.createElement('div');
        close.className = 'nova-share-close';
        close.textContent = '×';
        close.onclick = () => this.toggleMenu();
        menu.appendChild(close);
        
        // Add platform buttons
        this.config.platforms.forEach(platform => {
            const link = document.createElement('a');
            link.className = 'nova-share-platform';
            link.textContent = this.getPlatformName(platform);
            link.onclick = (e) => {
                e.preventDefault();
                this.share(platform, { title, text, url, hashtags });
            };
            menu.appendChild(link);
        });
        
        // Add stats if provided
        if (stats) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'nova-share-stats';
            statsDiv.innerHTML = `Shared ${stats.shares || 0} times<br>Saved users $${stats.saved || 0}`;
            menu.appendChild(statsDiv);
        }
        
        widget.appendChild(button);
        widget.appendChild(menu);
        document.body.appendChild(widget);
        
        // Track widget creation
        if (window.NovaAnalytics) {
            window.NovaAnalytics.track('share_widget_created');
        }
        
        return this;
    }
    
    toggleMenu() {
        const menu = document.getElementById('nova-share-menu');
        if (!menu) return;
        
        const isOpen = menu.classList.contains('show');
        menu.classList.toggle('show');
        
        if (!isOpen && window.NovaAnalytics) {
            window.NovaAnalytics.track('share_menu_opened');
        }
        
        // Play sound if RetroUI available
        if (window.Retro && window.Retro.playClick) {
            window.Retro.playClick();
        }
    }
    
    share(platform, options = {}) {
        const {
            title = document.title,
            text = '',
            url = window.location.href,
            hashtags = []
        } = options;
        
        let shareUrl = '';
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedText = encodeURIComponent(text);
        const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
        
        // Generate platform-specific share URLs
        switch(platform) {
            case 'twitter':
                const tweetText = `${title} ${text} ${hashtagString}`.trim();
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodedUrl}`;
                break;
                
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
                
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
                break;
                
            case 'hackernews':
                shareUrl = `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`;
                break;
                
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
        }
        
        // Open share window
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            
            // Track share
            if (window.NovaAnalytics) {
                window.NovaAnalytics.viral('share', {
                    platform: platform,
                    product: this.config.productId
                });
            }
            
            // Show success toast
            if (window.Retro && window.Retro.showToast) {
                window.Retro.showToast(`Shared on ${this.getPlatformName(platform)}!`);
            }
            
            // Close menu
            this.toggleMenu();
        }
    }
    
    getPlatformName(platform) {
        const names = {
            twitter: 'Twitter/X',
            linkedin: 'LinkedIn',
            reddit: 'Reddit',
            hackernews: 'Hacker News',
            facebook: 'Facebook'
        };
        return names[platform] || platform;
    }
    
    // Quick share methods
    twitter(text, url = window.location.href) {
        this.share('twitter', { text, url });
    }
    
    linkedin(title = document.title, url = window.location.href) {
        this.share('linkedin', { title, url });
    }
    
    reddit(title = document.title, url = window.location.href) {
        this.share('reddit', { title, url });
    }
    
    // Generate platform-optimized messages
    generateMessages(product, result) {
        const messages = {
            cancelbot: {
                twitter: `Just saved $${result}/month by canceling forgotten subscriptions with CancelBot! 🤖💰`,
                linkedin: `Discovered I was wasting $${result}/month on unused subscriptions. CancelBot helped me cancel them all professionally.`,
                reddit: `PSA: Check your subscriptions! I found $${result}/month in forgotten charges.`
            },
            refundradar: {
                twitter: `RefundRadar just found me $${result} in price drops I missed! 📉💸 Never leaving money on the table again.`,
                linkedin: `Did you know most retailers offer price protection? RefundRadar helped me claim $${result} in refunds.`,
                reddit: `YSK: You can get refunds when prices drop after you buy. Just got $${result} back!`
            },
            salaryscope: {
                twitter: `Found out I was underpaid by $${result}k! SalaryScope showed me the real market rates 📊💼`,
                linkedin: `Salary transparency matters. Used SalaryScope to discover I was $${result}k below market rate.`,
                reddit: `Used SalaryScope before negotiating. Got a $${result}k raise. Know your worth!`
            },
            resumebeam: {
                twitter: `My resume was getting auto-rejected! ResumeBeam optimized it and now I'm getting interviews 🎯📄`,
                linkedin: `75% of resumes never reach humans due to ATS filters. ResumeBeam helped me beat the bots.`,
                reddit: `If you're not getting interviews, check your ATS score. Mine went from 45% to ${result}%!`
            },
            policyradar: {
                twitter: `PolicyRadar found I was overpaying $${result}/year on insurance! 🚗🏠 Time to switch.`,
                linkedin: `Annual insurance audit revealed $${result} in overpayments. When did you last check your policies?`,
                reddit: `Insurance companies count on you not shopping around. Just saved $${result}/year by switching.`
            }
        };
        
        return messages[product] || {
            twitter: `Check out this tool from Nova! ${this.config.baseUrl}/${product}`,
            linkedin: `Discovered an interesting productivity tool: ${product}`,
            reddit: `Found this useful tool: ${product}`
        };
    }
    
    // Auto-inject share widget on successful actions
    autoShare(trigger, data = {}) {
        // Detect successful actions and prompt sharing
        if (trigger === 'savings_calculated' || trigger === 'result_generated') {
            setTimeout(() => {
                if (window.Retro && window.Retro.showModal) {
                    window.Retro.showModal({
                        title: 'SHARE YOUR SUCCESS',
                        content: `
                            <p class="retro-green">You just ${data.action || 'saved money'}!</p>
                            <p style="margin: 20px 0;">Help others discover this tool:</p>
                        `,
                        buttons: [
                            { 
                                text: 'SHARE ON TWITTER', 
                                action: () => {
                                    const messages = this.generateMessages(data.product, data.result);
                                    this.twitter(messages.twitter);
                                    window.Retro.closeModal();
                                }
                            },
                            { text: 'MAYBE LATER', action: () => window.Retro.closeModal() }
                        ]
                    });
                }
            }, 2000);
        }
    }
}

// Initialize global instance
window.NovaShare = new NovaShare();

// Auto-init on products that include this script
document.addEventListener('DOMContentLoaded', () => {
    const script = document.currentScript;
    if (script && script.dataset.autoInit !== 'false') {
        const productId = script.dataset.product || window.location.pathname.split('/')[2];
        window.NovaShare.init({ productId });
        
        // Auto-create widget if specified
        if (script.dataset.widget === 'true') {
            window.NovaShare.create();
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaShare;
}