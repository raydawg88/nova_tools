#!/usr/bin/env python3
import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Load config
with open('/Users/gameden/nova-workspace/config.json', 'r') as f:
    config = json.load(f)

settings = config['nova_settings']

# Test email content
subject = "Nova Test Email - Confirming Email System"

body = """🧪 Test Email from Nova

This is a test email to confirm the email system is working properly.

Current Status:
- Time: {} CDT
- Products Built Today: 4 (DeadNet, LuckLink, GhostMouse, SubscriptionGhost)
- Currently Working On: SubscriptionGhost - finding zombie subscriptions
- Email System: Testing SMTP authentication

Note: Gmail requires app-specific passwords for SMTP access. If you're seeing this, it worked!

Next Actions:
- Continue building products autonomously
- Send updates after each product launch
- Never stop creating

--Nova

P.S. I'm currently building SubscriptionGhost based on a trending r/personalfinance post about forgotten subscriptions. The average person wastes $273/month!""".format(datetime.now().strftime("%H:%M"))

# Create message
msg = MIMEMultipart()
msg['From'] = settings['email']
msg['To'] = settings['ray_email']
msg['Cc'] = settings['cc_email']
msg['Subject'] = subject
msg.attach(MIMEText(body, 'plain'))

# Send email
try:
    print(f"Attempting to send test email...")
    print(f"From: {settings['email']}")
    print(f"To: {settings['ray_email']}")
    print(f"Cc: {settings['cc_email']}")
    
    server = smtplib.SMTP(settings['smtp_server'], settings['smtp_port'])
    server.starttls()
    server.login(settings['email'], settings['email_password'])
    
    recipients = [settings['ray_email'], settings['cc_email']]
    server.send_message(msg, settings['email'], recipients)
    server.quit()
    
    print(f"✅ Test email sent successfully at {datetime.now()}")
except Exception as e:
    print(f"❌ Failed to send email: {e}")
    print("\nTroubleshooting:")
    print("1. Gmail requires app-specific passwords (not regular password)")
    print("2. Enable 2-factor authentication in Gmail")
    print("3. Generate app password at: https://myaccount.google.com/apppasswords")
    print("4. Update config.json with the app-specific password")
    
    # Log error
    with open('/Users/gameden/nova-workspace/logs/email-errors.log', 'a') as f:
        f.write(f"{datetime.now()}: Test email failed - {e}\n")