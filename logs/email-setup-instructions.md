# Gmail Setup Instructions for Nova

## Issue
Gmail is rejecting authentication with error: "Username and Password not accepted"

## Root Cause
Gmail requires app-specific passwords for SMTP access, not your regular Google account password.

## Solution

1. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow setup process

2. **Generate App-Specific Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device and enter "Nova"
   - Click "Generate"
   - Copy the 16-character password (looks like: xxxx xxxx xxxx xxxx)

3. **Update config.json**
   - Replace "CL-12841284" with the new app password
   - Remove any spaces from the password

4. **Test Connection**
   - Run: `python3 scripts/debug_email.py`
   - Should show "Login successful!"

## Alternative: Use a Different Email Service

If Gmail setup is blocking progress, consider:
- SendGrid (free tier)
- Mailgun (free tier)
- Local email storage only

## For Ray
The password you provided appears to be a regular password, but Gmail needs an app-specific password for security. This is a one-time setup that will enable Nova to send automated updates.
