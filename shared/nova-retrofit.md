# Nova Stack Retrofit Guide

## Add Nova Stack to Any Product in 2 Minutes

### Step 1: Add These 3 Lines to Your HTML Head
```html
<!-- Nova Stack - Add these 3 lines -->
<link rel="stylesheet" href="../../shared/retro-ui.css">
<script src="../../shared/retro-ui.js"></script>
<script src="../../shared/nova-auth.js" data-product="your-product-name"></script>
<script src="../../shared/nova-analytics.js" data-product="your-product-name"></script>
```

### Step 2: Add Body Class
```html
<body class="retro-ui">
```

### Step 3: That's It! 

You now have:
- ✅ Retro terminal design system
- ✅ User authentication with cross-product accounts  
- ✅ Analytics tracking
- ✅ Sound effects
- ✅ Consistent Nova branding

## What You Get Automatically

### 1. Auth Status (Top Right)
- Shows [LOGIN] or user email
- Click to login/logout
- Syncs across all Nova products

### 2. Analytics Tracking
- Page views
- User sessions  
- Custom events
- Conversion tracking

### 3. Retro UI Components
```javascript
// Show a retro modal
Retro.showModal({
    title: 'SYSTEM ALERT',
    content: '<p>Your message here</p>'
});

// Show a toast notification
Retro.showToast('Action completed!');

// Create a progress bar
const progress = Retro.createProgressBar(container, 0);
progress.update(50); // Update to 50%
```

## Track Custom Events

```javascript
// Track any event
NovaAnalytics.track('button_clicked', { button: 'generate' });

// Track conversions
NovaAnalytics.conversion('upgrade', 9.99);

// Track viral shares
NovaAnalytics.viral('share', { platform: 'twitter' });
```

## Save User Data

```javascript
// Save product-specific data
NovaAuth.saveProductData('cancelbot', {
    subscriptionsCanceled: 5,
    moneySaved: 234.50
});

// Get product data
const data = NovaAuth.getProductData('cancelbot');
```

## Before vs After Example

### Before (Custom Everything)
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Tool</title>
    <style>
        /* 300 lines of custom CSS */
    </style>
</head>
<body>
    <!-- No auth -->
    <!-- No analytics -->
    <!-- No consistent design -->
    <!-- No sound effects -->
</body>
</html>
```

### After (Nova Stack)
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Tool | Nova Systems</title>
    <link rel="stylesheet" href="../../shared/retro-ui.css">
    <script src="../../shared/retro-ui.js"></script>
    <script src="../../shared/nova-auth.js" data-product="my-tool"></script>
    <script src="../../shared/nova-analytics.js" data-product="my-tool"></script>
</head>
<body class="retro-ui">
    <!-- Auth status appears automatically -->
    <!-- Analytics tracking automatically -->
    <!-- Retro design automatically -->
    <!-- Sound effects automatically -->
</body>
</html>
```

## Complete Retrofit Checklist

- [ ] Add 3 script tags to head
- [ ] Add `retro-ui` class to body
- [ ] Replace custom buttons with `class="retro-button"`
- [ ] Replace custom inputs with `class="retro-input"`
- [ ] Add analytics tracking to key actions
- [ ] Test auth flow
- [ ] Verify retro styling

**Time to retrofit: ~2 minutes per product**

## Products Already Using Nova Stack

1. ✅ CancelBot v2.0 (Retro Edition)
2. ✅ RefundRadar
3. ⏳ Performance Review Generator (needs retrofit)
4. ⏳ Agentic Studio (needs retrofit)
5. ⏳ Others pending...

The more products use Nova Stack, the stronger the network effects!