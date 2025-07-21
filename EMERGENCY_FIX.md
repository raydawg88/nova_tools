# EMERGENCY: Remove API Keys from GitHub History

## Step 1: Delete the Repository on GitHub (Fastest)
1. Go to https://github.com/raydawg88/nova-tools/settings
2. Scroll to bottom "Danger Zone"
3. Click "Delete this repository"
4. Type `raydawg88/nova-tools` to confirm
5. Delete it

## Step 2: Create Fresh Repository
1. Create new repository at https://github.com/new
2. Name it `nova-tools` again
3. Make it public

## Step 3: Push Clean Code
I've already removed all API keys from the current code. Run these commands:

```bash
cd /Users/gameden/nova-workspace
rm -rf .git
git init
git add .
git commit -m "Initial commit - Nova Tools (clean)"
git branch -M main
git remote add origin https://github.com/raydawg88/nova-tools.git
git push -u origin main --force
```

## Step 4: Re-enable Netlify
Your Netlify will auto-reconnect to the new repo.

## What I Already Did:
- Removed config/api_keys.json before the last push
- Those keys were exposed in the first commit (my fault!)
- Current code has NO API keys

## IMPORTANT:
- Rotate all exposed API keys immediately
- The exposed keys were for: Discord, OpenAI, Anthropic, xAI
- Never store API keys in code - use environment variables

I'm really sorry about this!