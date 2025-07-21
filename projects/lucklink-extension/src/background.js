// LuckLink Background Service Worker
// Manages Omamori functionality and lifecycle

import { OMAMORI_TYPES, LIFECYCLE, ACTIVATION_MESSAGES } from './omamori-data.js';

// Active Omamori state
let activeOmamori = {};

// Initialize
chrome.runtime.onInstalled.addListener(() => {
  // Load saved Omamori
  chrome.storage.local.get(['activeOmamori'], (data) => {
    activeOmamori = data.activeOmamori || {};
    
    // Set up periodic checks
    chrome.alarms.create('omamoriCheck', { periodInMinutes: 60 });
    chrome.alarms.create('dailyFortune', { periodInMinutes: 1440 });
  });
});

// Monitor browsing for Omamori activation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkOmamoriTriggers(tab);
  }
});

// Check if any Omamori should activate
function checkOmamoriTriggers(tab) {
  const url = new URL(tab.url);
  
  // Money Omamori - Shopping sites
  if (activeOmamori.money && isShoppingSite(url.hostname)) {
    activateOmamori('money', tab.id, 'Shopping detected! Your Money Omamori is searching for deals...');
  }
  
  // Health Omamori - Food delivery after 9pm
  if (activeOmamori.health && isFoodDeliverySite(url.hostname)) {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 6) {
      activateOmamori('health', tab.id, 'Your Health Omamori gently reminds you: Late night cravings?');
    }
  }
  
  // Protection Omamori - Suspicious sites
  if (activeOmamori.protection && isSuspiciousSite(url.hostname)) {
    activateOmamori('protection', tab.id, '⚠️ Your Protection Omamori senses danger!');
    // In production, would block or warn
  }
  
  // Success Omamori - Social media procrastination
  if (activeOmamori.success && isProcrastinationSite(url.hostname)) {
    const motivationalQuote = getMotivationalQuote();
    activateOmamori('success', tab.id, motivationalQuote);
  }
}

// Activate an Omamori with visual feedback
function activateOmamori(type, tabId, message) {
  // Send to content script for visual effect
  chrome.tabs.sendMessage(tabId, {
    action: 'OMAMORI_ACTIVATE',
    type: type,
    message: message,
    color: OMAMORI_TYPES[type.toUpperCase()].color
  });
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'assets/icon128.png',
    title: 'LuckLink',
    message: message
  });
}

// Site detection helpers
function isShoppingSite(hostname) {
  const shoppingSites = ['amazon.com', 'ebay.com', 'etsy.com', 'target.com', 'walmart.com'];
  return shoppingSites.some(site => hostname.includes(site));
}

function isFoodDeliverySite(hostname) {
  const foodSites = ['ubereats.com', 'doordash.com', 'grubhub.com', 'postmates.com'];
  return foodSites.some(site => hostname.includes(site));
}

function isSuspiciousSite(hostname) {
  // In production, would use a real threat database
  return hostname.includes('suspicious') || hostname.includes('scam');
}

function isProcrastinationSite(hostname) {
  const timewasters = ['twitter.com', 'x.com', 'reddit.com', 'youtube.com', 'tiktok.com'];
  return timewasters.some(site => hostname.includes(site));
}

// Motivational quotes for Success Omamori
function getMotivationalQuote() {
  const quotes = [
    "Your Success Omamori whispers: Small steps lead to great journeys.",
    "Focus now, celebrate later. Your future self will thank you.",
    "The path to success is calling. Will you answer?",
    "Your potential is infinite. Your time is not. Choose wisely.",
    "Success is built in moments like these. Make it count."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Handle Omamori purchase
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PURCHASE_OMAMORI') {
    // Add to active Omamori
    activeOmamori[request.type] = {
      purchaseDate: Date.now(),
      expiryDate: Date.now() + LIFECYCLE.duration
    };
    
    // Save to storage
    chrome.storage.local.set({ activeOmamori }, () => {
      sendResponse({ success: true });
    });
    
    return true;
  }
});

// Daily fortune check
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyFortune') {
    generateDailyFortune();
  } else if (alarm.name === 'omamoriCheck') {
    checkOmamoriExpiry();
  }
});

// Generate daily fortune based on active Omamori
function generateDailyFortune() {
  const fortunes = {
    money: "Today's money fortune: A surprise opportunity awaits! 💰",
    love: "Today's love fortune: Someone is thinking of you right now 💕",
    health: "Today's health fortune: Your body will thank you for kind choices 🍃",
    success: "Today's success fortune: A breakthrough is near 🎯",
    protection: "Today's protection: You are shielded from negativity 🛡️",
    study: "Today's study fortune: Knowledge flows easily to you 📚"
  };
  
  const activeFortunes = Object.keys(activeOmamori)
    .filter(type => activeOmamori[type])
    .map(type => fortunes[type])
    .join('\n');
  
  if (activeFortunes) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'LuckLink Daily Fortune',
      message: activeFortunes
    });
  }
}

// Check for expiring Omamori
function checkOmamoriExpiry() {
  const now = Date.now();
  const warningTime = LIFECYCLE.warningDays * 24 * 60 * 60 * 1000;
  
  Object.entries(activeOmamori).forEach(([type, data]) => {
    if (data.expiryDate - now < warningTime) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon128.png',
        title: 'Omamori Expiring Soon',
        message: `Your ${OMAMORI_TYPES[type.toUpperCase()].name} expires in ${Math.floor((data.expiryDate - now) / (24 * 60 * 60 * 1000))} days. Renew for 50% off!`
      });
    }
  });
}