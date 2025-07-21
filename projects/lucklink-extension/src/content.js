// LuckLink Content Script
// Shows Omamori activation effects on web pages

let activeEffects = [];

// Listen for Omamori activation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OMAMORI_ACTIVATE') {
    showOmamoriEffect(request);
  }
});

// Show visual effect when Omamori activates
function showOmamoriEffect(data) {
  // Create effect container
  const effect = document.createElement('div');
  effect.className = 'lucklink-omamori-effect';
  effect.innerHTML = `
    <div class="lucklink-charm-icon">${getOmamoriEmoji(data.type)}</div>
    <div class="lucklink-message">${data.message}</div>
    <div class="lucklink-sparkles"></div>
  `;
  
  // Set color theme
  effect.style.setProperty('--omamori-color', data.color);
  
  document.body.appendChild(effect);
  
  // Animate entrance
  setTimeout(() => {
    effect.classList.add('lucklink-show');
  }, 100);
  
  // Create sparkle effects
  createSparkles(effect.querySelector('.lucklink-sparkles'));
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    effect.classList.remove('lucklink-show');
    setTimeout(() => effect.remove(), 500);
  }, 5000);
  
  activeEffects.push(effect);
}

// Get emoji for Omamori type
function getOmamoriEmoji(type) {
  const emojis = {
    money: '💰',
    love: '💕',
    health: '🍃',
    success: '🎯',
    protection: '🛡️',
    study: '📚'
  };
  return emojis[type] || '✨';
}

// Create sparkle animation
function createSparkles(container) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'lucklink-sparkle';
      sparkle.textContent = '✨';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 2000);
    }, i * 200);
  }
}

// Inject styles
const styles = document.createElement('style');
styles.textContent = `
  .lucklink-omamori-effect {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--omamori-color);
    border-radius: 12px;
    padding: 20px;
    z-index: 999999;
    opacity: 0;
    transform: translateX(320px);
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
  
  .lucklink-omamori-effect.lucklink-show {
    opacity: 1;
    transform: translateX(0);
  }
  
  .lucklink-charm-icon {
    font-size: 48px;
    text-align: center;
    margin-bottom: 10px;
    filter: drop-shadow(0 0 20px var(--omamori-color));
    animation: lucklink-float 3s ease-in-out infinite;
  }
  
  @keyframes lucklink-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .lucklink-message {
    color: white;
    font-family: -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .lucklink-sparkles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }
  
  .lucklink-sparkle {
    position: absolute;
    font-size: 20px;
    animation: lucklink-sparkle-rise 2s ease-out forwards;
  }
  
  @keyframes lucklink-sparkle-rise {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }
  
  /* Special effects for different Omamori types */
  .lucklink-omamori-effect[data-type="money"] {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 0, 0, 0.9));
  }
  
  .lucklink-omamori-effect[data-type="love"] {
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(0, 0, 0, 0.9));
  }
  
  .lucklink-omamori-effect[data-type="health"] {
    background: linear-gradient(135deg, rgba(144, 238, 144, 0.1), rgba(0, 0, 0, 0.9));
  }
  
  .lucklink-omamori-effect[data-type="success"] {
    background: linear-gradient(135deg, rgba(65, 105, 225, 0.1), rgba(0, 0, 0, 0.9));
  }
  
  .lucklink-omamori-effect[data-type="protection"] {
    background: linear-gradient(135deg, rgba(139, 0, 139, 0.1), rgba(0, 0, 0, 0.9));
  }
  
  .lucklink-omamori-effect[data-type="study"] {
    background: linear-gradient(135deg, rgba(255, 140, 0, 0.1), rgba(0, 0, 0, 0.9));
  }
`;

document.head.appendChild(styles);

// Special page modifications based on active Omamori
function applyOmamoriEffects() {
  chrome.storage.local.get(['activeOmamori'], (data) => {
    const active = data.activeOmamori || {};
    
    // Money Omamori - Highlight deals
    if (active.money && window.location.hostname.includes('amazon')) {
      highlightDeals();
    }
    
    // Success Omamori - Add motivational overlay to distracting sites
    if (active.success && isDistractingSite()) {
      addMotivationalOverlay();
    }
  });
}

// Highlight deals on shopping sites
function highlightDeals() {
  // Find price elements and add glow to good deals
  const priceElements = document.querySelectorAll('[class*="price"]');
  priceElements.forEach(el => {
    if (el.textContent.includes('$')) {
      el.style.textShadow = '0 0 10px #FFD700';
    }
  });
}

// Check if current site is distracting
function isDistractingSite() {
  const distractors = ['twitter', 'reddit', 'youtube', 'tiktok'];
  return distractors.some(site => window.location.hostname.includes(site));
}

// Add motivational overlay
function addMotivationalOverlay() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    background: linear-gradient(90deg, #4169E1, #1E90FF);
    color: white;
    text-align: center;
    font-family: -apple-system, sans-serif;
    font-size: 14px;
    z-index: 9999;
    cursor: pointer;
  `;
  overlay.textContent = '🎯 Your Success Omamori reminds you: Is this moving you toward your goals?';
  overlay.onclick = () => overlay.remove();
  
  document.body.prepend(overlay);
}

// Initialize
applyOmamoriEffects();