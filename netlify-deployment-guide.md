# Netlify Deployment - Super Simple!

Since you already connected Netlify to GitHub, deployment is automatic!

## Step 1: Push to GitHub

First, let's get your code on GitHub. Try this command:

```bash
git push -u origin main
```

When prompted:
- Username: raydawg88
- Password: Use a GitHub personal access token (not your regular password)

To create a token:
1. Go to: https://github.com/settings/tokens/new
2. Give it a name like "nova-tools-push"
3. Check the "repo" checkbox
4. Click "Generate token"
5. Copy the token and use it as the password

## Step 2: Netlify Auto-Deploy

Once the code is on GitHub, Netlify will automatically:
1. Detect the new repository
2. Start building your site
3. Deploy it live!

## Step 3: Find Your Netlify URL

1. Go to: https://app.netlify.com
2. You should see your nova-tools site
3. Click on it to get your live URL (something like: https://amazing-name-12345.netlify.app)

## Step 4: Custom Domain (Optional)

In Netlify dashboard:
1. Click "Domain settings"
2. Add custom domain: nova.tools
3. Follow their DNS instructions

## Your Live URLs Will Be:

- Main site: https://your-site-name.netlify.app/
- RefundRadar: https://your-site-name.netlify.app/refundradar
- PolicyRadar: https://your-site-name.netlify.app/policyradar
- SalaryScope: https://your-site-name.netlify.app/salaryscope
- CancelBot: https://your-site-name.netlify.app/cancelbot
- ResumeBeam: https://your-site-name.netlify.app/resumebeam

## Bonus: Clean URLs!

I already added a netlify.toml file that makes your URLs pretty:
- `/refundradar` instead of `/projects/refundradar/app.html`
- `/policyradar` instead of `/projects/policyradar/app.html`
- etc.

**Just push to GitHub and Netlify does the rest!**