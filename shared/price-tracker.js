// Real Price Tracking System for RefundRadar
class PriceTracker {
    constructor() {
        this.stores = {
            // Store configurations with their price check methods
            'Amazon': {
                urlPattern: /amazon\.com\/.*\/dp\/([A-Z0-9]{10})/,
                extractASIN: (url) => {
                    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
                    return match ? match[1] : null;
                },
                buildPriceUrl: (asin) => `https://www.amazon.com/dp/${asin}`,
                priceSelector: '.a-price-whole, .a-price.a-text-price.a-size-medium, .a-price-range'
            },
            'Best Buy': {
                urlPattern: /bestbuy\.com\/.*\/(\d{7})\.p/,
                extractSKU: (url) => {
                    const match = url.match(/\/(\d{7})\.p/);
                    return match ? match[1] : null;
                },
                buildPriceUrl: (sku) => `https://www.bestbuy.com/site/searchpage.jsp?st=${sku}`,
                priceSelector: '.pricing-price__regular-price, .sr-pricing-price'
            },
            'Target': {
                urlPattern: /target\.com\/p\/.*\/A-(\d{8})/,
                extractTCIN: (url) => {
                    const match = url.match(/\/A-(\d{8})/);
                    return match ? match[1] : null;
                },
                buildPriceUrl: (tcin) => `https://www.target.com/p/-/A-${tcin}`,
                priceSelector: '[data-test="product-price"], .h-text-bs'
            },
            'Walmart': {
                urlPattern: /walmart\.com\/ip\/.*\/(\d+)/,
                extractID: (url) => {
                    const match = url.match(/\/(\d+)($|\?)/);
                    return match ? match[1] : null;
                },
                buildPriceUrl: (id) => `https://www.walmart.com/ip/product/${id}`,
                priceSelector: '[itemprop="price"], .price-characteristic'
            }
        };
        
        // Price history cache
        this.priceCache = JSON.parse(localStorage.getItem('nova_price_cache') || '{}');
    }
    
    // Manual price entry system (more reliable than scraping)
    async checkPrice(purchase) {
        const cachedPrice = this.getCachedPrice(purchase);
        
        // If we have recent price data (less than 6 hours old), use it
        if (cachedPrice && (Date.now() - cachedPrice.timestamp < 6 * 60 * 60 * 1000)) {
            return cachedPrice.price;
        }
        
        // Otherwise, we need manual price input or automated check
        return this.manualPriceCheck(purchase);
    }
    
    manualPriceCheck(purchase) {
        // This creates a promise that resolves when user enters current price
        return new Promise((resolve) => {
            const modalId = 'price-check-' + purchase.id;
            
            Retro.showModal({
                title: 'MANUAL PRICE CHECK',
                content: `
                    <p class="retro-green">Check the current price for:</p>
                    <p class="retro-cyan" style="font-size: 18px; margin: 20px 0;">${purchase.itemName}</p>
                    <p>Store: ${purchase.storeName}</p>
                    <p>Original Price: $${purchase.pricePaid.toFixed(2)}</p>
                    <hr style="border-color: var(--retro-green); margin: 20px 0;">
                    <p class="retro-amber">Enter the current price you see on the store's website:</p>
                    <input type="number" 
                           id="${modalId}" 
                           class="retro-input" 
                           placeholder="Current price..." 
                           step="0.01"
                           style="width: 200px; margin: 20px auto; display: block;">
                    <p style="font-size: 12px; color: #666;">Leave blank if item is no longer available</p>
                `,
                buttons: [
                    {
                        text: 'SUBMIT PRICE',
                        action: () => {
                            const priceInput = document.getElementById(modalId);
                            const currentPrice = parseFloat(priceInput.value);
                            
                            if (!isNaN(currentPrice) && currentPrice > 0) {
                                // Cache the price
                                this.cachePrice(purchase, currentPrice);
                                resolve(currentPrice);
                            } else {
                                resolve(null);
                            }
                            Retro.closeModal();
                        }
                    },
                    {
                        text: 'SKIP',
                        action: () => {
                            resolve(null);
                            Retro.closeModal();
                        }
                    }
                ]
            });
        });
    }
    
    // Import purchases from common formats
    importFromText(text, storeName) {
        const purchases = [];
        
        // Try to parse different receipt formats
        const lines = text.split('\n');
        let currentItem = null;
        
        for (const line of lines) {
            // Look for price patterns
            const priceMatch = line.match(/\$?([\d,]+\.?\d{0,2})/);
            
            if (priceMatch && currentItem) {
                const price = parseFloat(priceMatch[1].replace(',', ''));
                if (price > 0) {
                    purchases.push({
                        itemName: currentItem,
                        storeName: storeName || 'Unknown Store',
                        pricePaid: price,
                        url: ''
                    });
                    currentItem = null;
                }
            } else if (line.trim().length > 3 && !priceMatch) {
                // Likely an item name
                currentItem = line.trim();
            }
        }
        
        return purchases;
    }
    
    // Email receipt parser
    parseEmailReceipt(emailContent) {
        const purchases = [];
        
        // Common patterns in email receipts
        const orderPatterns = [
            /Item:\s*(.+?)\s*Price:\s*\$?([\d,]+\.?\d{0,2})/gi,
            /(.+?)\s+\$?([\d,]+\.?\d{0,2})\s*(?:USD|usd)?/gi,
            /Description:\s*(.+?)\s*Amount:\s*\$?([\d,]+\.?\d{0,2})/gi
        ];
        
        for (const pattern of orderPatterns) {
            let match;
            while ((match = pattern.exec(emailContent)) !== null) {
                const itemName = match[1].trim();
                const price = parseFloat(match[2].replace(',', ''));
                
                if (itemName && price > 0) {
                    purchases.push({
                        itemName: itemName.substring(0, 100), // Limit length
                        pricePaid: price
                    });
                }
            }
        }
        
        return purchases;
    }
    
    // Price comparison with protection policies
    calculateRefund(purchase, currentPrice) {
        if (!currentPrice || currentPrice >= purchase.pricePaid) {
            return 0;
        }
        
        const priceDrop = purchase.pricePaid - currentPrice;
        const daysSincePurchase = (Date.now() - new Date(purchase.dateAdded).getTime()) / (1000 * 60 * 60 * 24);
        
        // Store-specific price protection windows
        const protectionWindows = {
            'Amazon': 7,    // Very limited
            'Best Buy': 15, // Price match guarantee
            'Target': 14,   // Price match policy
            'Walmart': 7,   // Limited time
            'Costco': 30,   // Member benefit
            'Home Depot': 90, // Generous policy
            'Lowes': 30,    // Price protection
            'Default': 14   // Average
        };
        
        const window = protectionWindows[purchase.storeName] || protectionWindows['Default'];
        
        if (daysSincePurchase <= window) {
            return priceDrop;
        }
        
        return 0;
    }
    
    // Cache management
    cachePrice(purchase, price) {
        const key = `${purchase.storeName}_${purchase.itemName}`.toLowerCase().replace(/\s+/g, '_');
        this.priceCache[key] = {
            price: price,
            timestamp: Date.now()
        };
        localStorage.setItem('nova_price_cache', JSON.stringify(this.priceCache));
    }
    
    getCachedPrice(purchase) {
        const key = `${purchase.storeName}_${purchase.itemName}`.toLowerCase().replace(/\s+/g, '_');
        return this.priceCache[key];
    }
    
    // Generate price history chart data
    getPriceHistory(purchase) {
        const key = `history_${purchase.id}`;
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Add current data point
        if (purchase.currentPrice && purchase.currentPrice !== purchase.pricePaid) {
            history.push({
                date: new Date().toISOString(),
                price: purchase.currentPrice
            });
            localStorage.setItem(key, JSON.stringify(history));
        }
        
        return history;
    }
    
    // Bulk import from CSV
    importCSV(csvContent) {
        const lines = csvContent.split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const purchases = [];
        
        // Find relevant columns
        const itemCol = headers.findIndex(h => h.includes('item') || h.includes('product') || h.includes('description'));
        const priceCol = headers.findIndex(h => h.includes('price') || h.includes('amount') || h.includes('cost'));
        const storeCol = headers.findIndex(h => h.includes('store') || h.includes('merchant') || h.includes('vendor'));
        const dateCol = headers.findIndex(h => h.includes('date') || h.includes('purchased'));
        
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            
            if (itemCol >= 0 && priceCol >= 0 && cols[itemCol] && cols[priceCol]) {
                const price = parseFloat(cols[priceCol].replace(/[$,]/g, ''));
                if (price > 0) {
                    purchases.push({
                        itemName: cols[itemCol],
                        pricePaid: price,
                        storeName: storeCol >= 0 ? cols[storeCol] : 'Imported',
                        dateAdded: dateCol >= 0 ? cols[dateCol] : new Date().toISOString()
                    });
                }
            }
        }
        
        return purchases;
    }
}

// Export for use in RefundRadar
window.PriceTracker = PriceTracker;