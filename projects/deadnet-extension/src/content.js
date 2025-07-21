// DeadNet Content Script
// Injects archive UI into dying platforms

let archiveWidget = null;

// Listen for platform risk alerts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PLATFORM_AT_RISK') {
    showArchiveWidget(request.platform, request.risk);
  }
});

function showArchiveWidget(platform, riskInfo) {
  // Don't show multiple widgets
  if (archiveWidget) return;
  
  // Create widget HTML
  archiveWidget = document.createElement('div');
  archiveWidget.id = 'deadnet-widget';
  archiveWidget.innerHTML = `
    <div class="deadnet-container">
      <div class="deadnet-header">
        <span class="deadnet-skull">💀</span>
        <h3>Platform at Risk!</h3>
        <button class="deadnet-close" id="deadnet-close">×</button>
      </div>
      <div class="deadnet-content">
        <div class="deadnet-risk-meter">
          <div class="deadnet-risk-bar" style="width: ${riskInfo.risk}%"></div>
          <span class="deadnet-risk-text">${riskInfo.risk}% Death Risk</span>
        </div>
        <p class="deadnet-reason">${riskInfo.reason}</p>
        <div class="deadnet-stats">
          <div class="deadnet-stat">
            <span class="deadnet-number" id="content-count">...</span>
            <span class="deadnet-label">items at risk</span>
          </div>
          <div class="deadnet-stat">
            <span class="deadnet-number" id="days-left">???</span>
            <span class="deadnet-label">est. days left</span>
          </div>
        </div>
        <button class="deadnet-archive-btn" id="deadnet-archive">
          Archive My Memories Now
        </button>
        <p class="deadnet-tagline">Don't let your digital memories die with the platform</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(archiveWidget);
  
  // Animate entrance
  setTimeout(() => {
    archiveWidget.classList.add('deadnet-show');
  }, 100);
  
  // Count content items (simplified for MVP)
  const contentCount = document.querySelectorAll('img, video, article, post').length;
  document.getElementById('content-count').textContent = contentCount;
  
  // Estimate days left (mock calculation)
  const daysLeft = Math.floor((100 - riskInfo.risk) * 3.65);
  document.getElementById('days-left').textContent = daysLeft;
  
  // Event handlers
  document.getElementById('deadnet-close').addEventListener('click', hideWidget);
  document.getElementById('deadnet-archive').addEventListener('click', () => {
    startArchiving(platform, contentCount);
  });
}

function hideWidget() {
  if (archiveWidget) {
    archiveWidget.classList.remove('deadnet-show');
    setTimeout(() => {
      archiveWidget.remove();
      archiveWidget = null;
    }, 300);
  }
}

function startArchiving(platform, itemCount) {
  const archiveBtn = document.getElementById('deadnet-archive');
  archiveBtn.textContent = 'Archiving...';
  archiveBtn.disabled = true;
  
  // Simulate archiving process
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    archiveBtn.textContent = `Archiving... ${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Send archive complete message
      chrome.runtime.sendMessage({
        action: 'ARCHIVE_CONTENT',
        platform: platform,
        itemCount: itemCount
      }, (response) => {
        if (response.success) {
          archiveBtn.textContent = '✓ Memories Saved!';
          archiveBtn.classList.add('deadnet-success');
          
          // Show share prompt
          setTimeout(() => {
            showSharePrompt(response.totalMemoriesSaved);
          }, 1500);
        }
      });
    }
  }, 200);
}

function showSharePrompt(totalSaved) {
  const shareHtml = `
    <div class="deadnet-share">
      <h4>You've saved ${totalSaved} digital memories!</h4>
      <p>Warn your friends before it's too late:</p>
      <button class="deadnet-share-btn" onclick="window.open('https://twitter.com/intent/tweet?text=I%20just%20saved%20${totalSaved}%20digital%20memories%20from%20dying%20platforms%20with%20DeadNet!%20Don%27t%20let%20your%20content%20disappear%20forever.%20%F0%9F%92%80&url=https://deadnet.lol', '_blank')">
        Share on X/Twitter
      </button>
    </div>
  `;
  
  document.querySelector('.deadnet-content').innerHTML += shareHtml;
}

// Inject styles
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  #deadnet-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    font-family: 'Inter', sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  #deadnet-widget.deadnet-show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .deadnet-container {
    width: 320px;
    background: #000;
    border: 2px solid #ff0000;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(255, 0, 0, 0.3);
    overflow: hidden;
  }
  
  .deadnet-header {
    background: #ff0000;
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .deadnet-skull {
    font-size: 24px;
    margin-right: 8px;
  }
  
  .deadnet-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    flex: 1;
  }
  
  .deadnet-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .deadnet-content {
    padding: 20px;
    color: white;
  }
  
  .deadnet-risk-meter {
    position: relative;
    height: 30px;
    background: #222;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  
  .deadnet-risk-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #ff0000, #ff6600);
    transition: width 1s ease;
  }
  
  .deadnet-risk-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .deadnet-reason {
    font-size: 13px;
    color: #ccc;
    margin: 12px 0;
    line-height: 1.4;
  }
  
  .deadnet-stats {
    display: flex;
    gap: 20px;
    margin: 20px 0;
  }
  
  .deadnet-stat {
    flex: 1;
    text-align: center;
  }
  
  .deadnet-number {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #ff6600;
  }
  
  .deadnet-label {
    display: block;
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
  }
  
  .deadnet-archive-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #ff0000, #ff6600);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .deadnet-archive-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 0, 0, 0.4);
  }
  
  .deadnet-archive-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .deadnet-archive-btn.deadnet-success {
    background: linear-gradient(135deg, #00ff00, #00cc00);
  }
  
  .deadnet-tagline {
    font-size: 11px;
    color: #666;
    text-align: center;
    margin: 12px 0 0;
    font-style: italic;
  }
  
  .deadnet-share {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #333;
  }
  
  .deadnet-share h4 {
    margin: 0 0 8px;
    font-size: 14px;
  }
  
  .deadnet-share p {
    margin: 0 0 12px;
    font-size: 12px;
    color: #ccc;
  }
  
  .deadnet-share-btn {
    width: 100%;
    padding: 10px;
    background: #1da1f2;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
`;

document.head.appendChild(style);