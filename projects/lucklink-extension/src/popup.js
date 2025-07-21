// LuckLink Popup Script
import { OMAMORI_TYPES, BUNDLES } from './omamori-data.js';

// Mock owned Omamori (in production, from storage)
const ownedOmamori = ['money'];

// Render Omamori grid
function renderOmamori() {
  const grid = document.getElementById('omamori-grid');
  
  Object.values(OMAMORI_TYPES).forEach(omamori => {
    const card = document.createElement('div');
    card.className = 'omamori-card';
    if (ownedOmamori.includes(omamori.id)) {
      card.classList.add('owned');
    }
    
    card.style.setProperty('--charm-color', omamori.color);
    
    card.innerHTML = `
      <div class="charm-emoji">${omamori.emoji}</div>
      <div class="charm-name">${omamori.name}</div>
      <div class="charm-price">${ownedOmamori.includes(omamori.id) ? 'Active' : '$' + omamori.price}</div>
    `;
    
    card.addEventListener('click', () => showOmamoriDetails(omamori));
    grid.appendChild(card);
  });
}

// Show Omamori details
function showOmamoriDetails(omamori) {
  // In production, this would show a detailed view
  console.log('Selected:', omamori);
  
  // For demo, show features
  const features = omamori.features.join('\n• ');
  alert(`${omamori.name}\n\n${omamori.description}\n\nFeatures:\n• ${features}\n\n"${omamori.blessing}"`);
}

// Render active charms
function renderActiveCharms() {
  const container = document.getElementById('active-charms');
  container.innerHTML = '';
  
  ownedOmamori.forEach(id => {
    const omamori = OMAMORI_TYPES[id.toUpperCase()];
    if (omamori) {
      const charm = document.createElement('div');
      charm.className = 'active-charm';
      charm.innerHTML = `
        <div class="charm-glow" style="--charm-color: ${omamori.color}"></div>
        <span>${omamori.emoji}</span>
      `;
      charm.title = omamori.name;
      container.appendChild(charm);
    }
  });
}

// Bundle click handler
document.getElementById('bundle-offer').addEventListener('click', () => {
  alert('Bundle Deal!\n\nGet all 6 Omamori for just $9.99\n(Save $7.95)\n\nEach charm brings unique protection and features to enhance your digital life.');
});

// Initialize
renderOmamori();
renderActiveCharms();

// Add floating sparkles
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.textContent = '✨';
  sparkle.style.position = 'fixed';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = window.innerHeight + 'px';
  sparkle.style.fontSize = Math.random() * 10 + 10 + 'px';
  sparkle.style.opacity = '0.3';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.animation = 'float 10s linear';
  
  document.querySelector('.bg-animation').appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 10000);
}

// Create sparkles periodically
setInterval(createSparkle, 3000);