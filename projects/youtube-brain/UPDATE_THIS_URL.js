// After deploying Firebase Functions, update this URL in channel-processor.js

// Find this line (around line 21):
const response = await fetch('https://us-central1-youtube-brain-mvp.cloudfunctions.net/processYouTubeChannel', {

// Replace with your actual Firebase Function URL:
const response = await fetch('https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/processYouTubeChannel', {