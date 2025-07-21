# YouTube Brain - Turn Any Creator Into AI Knowledge

Transform entire YouTube channels into AI-ready knowledge bases. Extract mental models, frameworks, and insights from any creator.

## 🚀 How It Works

1. **Paste a Channel URL** - Like @shaanpuri or @naval
2. **We Process Everything** - Analyzes all videos (takes 10-30 minutes)
3. **Get AI Knowledge** - Receive .json and .md files via email
4. **Use with Any AI** - Upload to ChatGPT, Claude, or any LLM

## 🏗️ Architecture (Simple MVP)

```
Frontend (Netlify)          Firebase Functions          Email (Nova)
     |                            |                         |
User enters -----> Triggers -----> Processes all -----> Sends files
channel URL        function        videos async          as attachments
```

### Frontend
- Clean, professional UI (no more black/red)
- Single page app with knowledge extraction
- Hosted on Netlify (nova-tools.netlify.app)

### Backend (Firebase)
- Simple Firebase Function for async processing
- No storage needed - just process and email
- Uses Nova's existing email setup

### Email
- Nova sends the email with 3 attachments:
  - `creator-knowledge.json` - Full structured data
  - `creator-knowledge.md` - Human-readable summary  
  - `creator-ai-context.txt` - Ready to paste into any AI

## 🛠️ Setup Instructions

### 1. Deploy Frontend
Already live at: https://nova-tools.netlify.app/projects/youtube-brain/app.html

### 2. Deploy Firebase Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
cd youtube-brain/firebase
firebase init functions

# Deploy
firebase deploy --only functions
```

### 3. Update Frontend URL
In `channel-processor.js`, update the Firebase function URL:
```javascript
const response = await fetch('https://YOUR-PROJECT.cloudfunctions.net/processYouTubeChannel', {
```

## 📝 What's Needed for Production

### 1. Real YouTube Transcript API
Current options:
- **youtube-transcript** npm package (server-side only)
- **YouTube Data API v3** + captions (requires API key)
- **Scraping service** (like ScrapingBee with YouTube support)

### 2. Better Knowledge Extraction
The current extraction is basic pattern matching. For production:
- Use GPT-4 or Claude API to analyze transcripts
- Extract deeper patterns across videos
- Build relationship graphs between concepts

### 3. Rate Limiting & Error Handling
- Queue system for multiple requests
- Retry failed videos
- Handle API limits gracefully

## 💰 Value Proposition

This is a REAL product people will pay for:
- Save hours of watching videos
- Get structured knowledge from any creator
- Make any AI think like your favorite YouTuber
- Perfect for learning from Naval, YC, Shaan Puri, etc.

## 🚀 Quick Start (Demo Mode)

The frontend works now in demo mode:
1. Visit: https://nova-tools.netlify.app/projects/youtube-brain/app.html
2. Click "Naval Ravikant" or "Shaan Puri" 
3. See demo extraction results
4. For channels: Enter email (shows what you'd receive)

## 📧 Example Email Output

When processing completes, users receive:

```
Subject: 🧠 Shaan Puri Knowledge Base Ready!

Hey! Nova here. I've finished analyzing Shaan Puri's entire YouTube channel.

What I Found:
• Analyzed 47 videos
• Extracted 156 key insights  
• Identified 23 mental models
• Found 12 recurring themes

Attached files:
- shaan-puri-knowledge.json (456 KB)
- shaan-puri-knowledge.md (89 KB)
- shaan-puri-ai-context.txt (12 KB)

Now you can make any AI think like Shaan!
```

## 🎯 Next Steps

1. **Get Firebase project** - Ray needs to create one
2. **Deploy functions** - 5 minute setup
3. **Add real transcript API** - Main technical challenge
4. **Launch on ProductHunt** - This solves a real problem!

---

Built by Nova & Ray - Making simple tools people love.