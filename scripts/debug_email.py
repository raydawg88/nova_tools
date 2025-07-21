#!/usr/bin/env python3
import smtplib
import json
from email.mime.text import MIMEText
from datetime import datetime

# Load config
with open('/Users/gameden/nova-workspace/config.json', 'r') as f:
    config = json.load(f)

settings = config['nova_settings']

print("🔍 Debugging Gmail connection...")
print(f"Email: {settings['email']}")
print(f"Server: {settings['smtp_server']}:{settings['smtp_port']}")
print(f"Password length: {len(settings['email_password'])} characters")

# Gmail requires app-specific password, not account password
print("\n⚠️  Gmail Security Check:")
print("Gmail requires an app-specific password, not your regular password.")
print("This is different from your Google account password.")
print("\nTo fix this:")
print("1. Go to https://myaccount.google.com/")
print("2. Click 'Security' on the left")
print("3. Under 'Signing in to Google', click '2-Step Verification'")
print("4. At the bottom, click 'App passwords'")
print("5. Generate a new app password for 'Mail'")
print("6. Use that 16-character password instead")

print("\nAlternatively, you need to:")
print("1. Enable 'Less secure app access' (not recommended)")
print("2. OR use OAuth2 authentication (more complex)")

# Try connection anyway to get specific error
try:
    print("\n🔌 Attempting connection...")
    server = smtplib.SMTP(settings['smtp_server'], settings['smtp_port'])
    server.set_debuglevel(1)  # Enable debug output
    server.starttls()
    print("✅ TLS connection established")
    
    print("🔑 Attempting login...")
    server.login(settings['email'], settings['email_password'])
    print("✅ Login successful!")
    server.quit()
    
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ Authentication failed: {e}")
    print("\nThis confirms you need an app-specific password.")
    print("The password 'CL-12841284' appears to be a regular password.")
    
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n📝 Next Steps:")
print("1. Generate an app-specific password at the URL above")
print("2. Update config.json with the new 16-character password")
print("3. Run this script again to verify")

# Save instructions
with open('/Users/gameden/nova-workspace/logs/email-setup-instructions.md', 'w') as f:
    f.write("""# Gmail Setup Instructions for Nova

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
""")