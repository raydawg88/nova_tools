// DeadNet - Background Service Worker
// Tracks dying platforms and alerts users

const DYING_PLATFORMS = {
  'tumblr.com': { risk: 85, reason: 'Massive user exodus, multiple ownership changes' },
  'reddit.com': { risk: 45, reason: 'API changes driving users away' },
  'twitter.com': { risk: 60, reason: 'Rebranding chaos, user decline' },
  'x.com': { risk: 60, reason: 'Rebranding chaos, user decline' },
  'deviantart.com': { risk: 70, reason: 'AI controversy, artist exodus' },
  'flickr.com': { risk: 80, reason: 'Multiple ownership changes, declining relevance' },
  'soundcloud.com': { risk: 65, reason: 'Financial struggles, limited monetization' },
  'vimeo.com': { risk: 55, reason: 'Shifting business model away from creators' },
  'myspace.com': { risk: 95, reason: 'Already mostly dead, data at risk' },
  'photobucket.com': { risk: 90, reason: 'Paywall disaster, mass deletion threats' }
};

// Platform death predictions based on patterns
const DEATH_SIGNALS = [
  'ownership change',
  'mass layoffs',
  'api restrictions',
  'paywall introduction',
  'user data monetization',
  'acquisition by larger company',
  'pivot away from core users'
];

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    archivedPlatforms: [],
    totalMemoriesSaved: 0,
    lastArchiveDate: null
  });
});

// Check if current tab is on a dying platform
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');
    
    if (DYING_PLATFORMS[domain]) {
      // Send alert to content script
      chrome.tabs.sendMessage(tabId, {
        action: 'PLATFORM_AT_RISK',
        platform: domain,
        risk: DYING_PLATFORMS[domain]
      });
      
      // Update badge
      chrome.action.setBadgeText({ text: '!', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    }
  }
});

// Handle archive requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ARCHIVE_CONTENT') {
    // In real implementation, this would handle actual archiving
    // For MVP, we'll simulate the process
    chrome.storage.local.get(['archivedPlatforms', 'totalMemoriesSaved'], (data) => {
      const updated = {
        archivedPlatforms: [...data.archivedPlatforms, request.platform],
        totalMemoriesSaved: data.totalMemoriesSaved + request.itemCount,
        lastArchiveDate: new Date().toISOString()
      };
      
      chrome.storage.local.set(updated, () => {
        sendResponse({ success: true, ...updated });
      });
    });
    
    return true; // Keep message channel open
  }
});

// Daily check for platform health
chrome.alarms.create('platformHealthCheck', { periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'platformHealthCheck') {
    // In production, this would check platform status via APIs
    console.log('Running daily platform health check...');
  }
});