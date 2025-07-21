# SEO Optimization for Nova Products

## Title Tags & Meta Descriptions

### RefundRadar
```html
<title>RefundRadar - Automatic Price Drop Refunds | Save Money on Past Purchases</title>
<meta name="description" content="Get money back when prices drop after you buy. RefundRadar monitors your purchases and helps claim refunds. Average user saves $487/year.">
<meta name="keywords" content="price drop refund, price protection, price match after purchase, get money back price drop">
```

### PolicyRadar  
```html
<title>PolicyRadar - Stop Overpaying for Insurance | Free Insurance Audit</title>
<meta name="description" content="Discover if you're overpaying for insurance. Free audit finds missing discounts and better rates. Average savings: $1,400/year.">
<meta name="keywords" content="insurance overpayment, insurance audit, save money insurance, insurance discounts">
```

### SalaryScope
```html
<title>SalaryScope - Real Salary Data for Negotiations | Know Your Worth</title>
<meta name="description" content="Anonymous salary data from verified employees. Know your worth before negotiating. Users report $10-50k salary increases.">
<meta name="keywords" content="salary data, salary negotiation, what should I earn, salary transparency">
```

### CancelBot
```html
<title>CancelBot - Cancel Any Subscription in Seconds | Stop Wasting Money</title>
<meta name="description" content="Generate professional cancellation emails for any subscription. Multiple tones from polite to firm. Save $50-200/month.">
<meta name="keywords" content="cancel subscription, cancellation email template, how to cancel subscription">
```

### ResumeBeam
```html
<title>ResumeBeam - Beat ATS Resume Scanners | 3x More Interviews</title>
<meta name="description" content="Optimize your resume to pass ATS filters. 75% of resumes never reach humans. Get your resume seen and land interviews.">
<meta name="keywords" content="ATS resume, resume optimization, applicant tracking system, resume scanner">
```

## URL Structure

- nova.tools/refundradar (not /app1)
- nova.tools/policyradar (not /insurance-tool)
- nova.tools/salaryscope (not /salary)

## Content Strategy Per Product

### RefundRadar Blog Posts
1. "Amazon Price Protection: Complete 2025 Guide"
2. "Best Buy Price Match After Purchase Policy"
3. "How I Got $2,400 Back Using Price Protection"
4. "Credit Card Price Protection Benefits You're Missing"

### PolicyRadar Blog Posts
1. "23 Insurance Discounts You're Probably Missing"
2. "Why Insurance Rates Increase (And How to Fight Back)"
3. "Insurance Audit Checklist: Save $1000+ Annually"
4. "Switching Insurance: Complete Guide 2025"

### SalaryScope Blog Posts
1. "[Company] Software Engineer Salary Guide 2025"
2. "How to Negotiate Salary: Data-Driven Approach"
3. "Why You're Probably Underpaid (With Data)"
4. "Salary Negotiation Email Templates That Work"

## Link Building Strategy

### Tier 1 (High Authority)
- Product Hunt launch
- Hacker News Show HN
- Indie Hackers milestone post
- BetaList submission

### Tier 2 (Niche Relevant)
- Personal finance blogs guest posts
- Frugal living site mentions
- Career advice site features
- Insurance comparison site listings

### Tier 3 (Volume)
- Directory submissions (50+)
- Forum signatures
- Blog comments (valuable only)
- Social bookmarks

## Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RefundRadar",
  "applicationCategory": "FinanceApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

## Local SEO (Yes, for SaaS too)

Create Google Business profiles:
- "Nova Tools - Money Saving Software"
- Category: Software Company
- Add all products as services
- Get reviews from early users

## Page Speed Optimization

Current issues to fix:
- [ ] Minify CSS/JS
- [ ] Compress images
- [ ] Add lazy loading
- [ ] Enable caching headers
- [ ] CDN for static assets

## Tracking Setup

```javascript
// Add to every page
gtag('event', 'page_view', {
  page_title: 'RefundRadar - Home',
  page_location: window.location.href,
  page_path: window.location.pathname
});

// Track conversions
gtag('event', 'sign_up', {
  method: 'google',
  value: 47.00,
  currency: 'USD'
});
```

## The SEO Reality Check

**Stop**: Building without keyword research
**Start**: Building what people search for

**Stop**: Clever product names
**Start**: SEO-friendly names (RefundRadar > "PriceHawk")

**Stop**: Single page apps with no content
**Start**: Content-rich landing pages

**Stop**: Waiting for organic traffic
**Start**: Creating content from day 1