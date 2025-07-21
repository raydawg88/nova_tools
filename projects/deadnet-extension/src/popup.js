// DeadNet Popup Script

const PLATFORMS = [
  { name: 'Tumblr', risk: 85, level: 'high' },
  { name: 'Twitter/X', risk: 60, level: 'medium' },
  { name: 'DeviantArt', risk: 70, level: 'high' },
  { name: 'Flickr', risk: 80, level: 'high' },
  { name: 'SoundCloud', risk: 65, level: 'medium' }
];

// Load stats from storage
chrome.storage.local.get(['totalMemoriesSaved', 'archivedPlatforms'], (data) => {
  document.getElementById('total-saved').textContent = data.totalMemoriesSaved || 0;
  document.getElementById('platforms-archived').textContent = 
    (data.archivedPlatforms || []).length;
});

// Render platform list
const container = document.getElementById('platform-container');
PLATFORMS.forEach(platform => {
  const item = document.createElement('div');
  item.className = 'platform-item';
  item.innerHTML = `
    <span class="platform-name">${platform.name}</span>
    <span class="platform-risk risk-${platform.level}">${platform.risk}% RISK</span>
  `;
  container.appendChild(item);
});

// Button handlers
document.getElementById('scan-current').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'FORCE_SCAN' });
    window.close();
  });
});

document.getElementById('view-archives').addEventListener('click', () => {
  // In production, this would open the archive viewer
  chrome.tabs.create({ url: 'https://deadnet.lol/archives' });
});