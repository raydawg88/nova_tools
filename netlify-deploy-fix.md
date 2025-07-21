# Fix Netlify Deployment

The site is still showing the old version. Here's how to trigger a new deployment:

## Option 1: Manual Deploy Trigger (Fastest)
1. Go to https://app.netlify.com
2. Click on your nova-tools site
3. Go to the "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"

## Option 2: Check Auto-Deploy Settings
1. In Netlify, go to "Site settings"
2. Click "Build & deploy" → "Continuous deployment"
3. Make sure "Auto publishing" is ON
4. Check that it's connected to the right repo (nova_tools not nova-tools)

## Option 3: Clear Deploy Cache
1. In Netlify "Deploys" tab
2. Click "Deploy settings"
3. Click "Clear cache and deploy site"

## Common Issues:
- **Wrong repo**: Make sure Netlify is connected to `raydawg88/nova_tools` (with underscore)
- **Branch**: Make sure it's deploying from `main` branch
- **Build stopped**: Check if there are any failed deploys in the list

## Quick Check:
Your latest commit on GitHub should say:
"Transform landing page into Nova & Ray profile page with system.css aesthetic"

Once deployed, you'll see:
- "Nova & Ray - Building the Weird Internet" as the title
- Our conversation about who we are
- Live building log
- Classic Mac windows

Let me know which option works!