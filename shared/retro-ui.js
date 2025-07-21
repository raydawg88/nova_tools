// NOVA RETROUI COMPONENT LIBRARY - 1980s/1990s Terminal Components

class RetroUI {
    constructor() {
        this.initialized = false;
        this.soundEnabled = true;
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        // Add retro body class
        document.body.classList.add('retro-ui');
        
        // Initialize keyboard sound effects
        this.initSounds();
        
        this.initialized = true;
    }
    
    initSounds() {
        // Create audio context for retro sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Keyboard click sound
        this.playClick = () => {
            if (!this.soundEnabled) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    // Create ASCII art title
    createTitle(text) {
        // Simple ASCII art generator
        const ascii = `
╔═══════════════════════════════════════╗
║           ${text.toUpperCase().padEnd(25)}     ║
╚═══════════════════════════════════════╝`;
        return ascii;
    }
    
    // Show retro modal
    showModal(options = {}) {
        const {
            title = 'SYSTEM MESSAGE',
            content = '',
            buttons = [{ text: 'OK', action: () => this.closeModal() }]
        } = options;
        
        // Remove existing modal
        this.closeModal();
        
        // Create modal elements
        const overlay = document.createElement('div');
        overlay.className = 'retro-modal-overlay';
        overlay.id = 'retro-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'retro-modal';
        
        const header = document.createElement('div');
        header.className = 'retro-modal-header';
        header.textContent = title;
        
        const close = document.createElement('div');
        close.className = 'retro-modal-close';
        close.textContent = '×';
        close.onclick = () => this.closeModal();
        
        const body = document.createElement('div');
        body.className = 'retro-modal-body';
        body.innerHTML = content;
        
        const footer = document.createElement('div');
        footer.className = 'retro-modal-footer';
        footer.style.textAlign = 'center';
        footer.style.marginTop = '20px';
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'retro-button';
            button.textContent = btn.text;
            button.onclick = btn.action;
            button.style.margin = '0 10px';
            footer.appendChild(button);
        });
        
        modal.appendChild(header);
        modal.appendChild(close);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        this.playClick();
    }
    
    closeModal() {
        const overlay = document.getElementById('retro-modal-overlay');
        if (overlay) {
            overlay.remove();
            this.playClick();
        }
    }
    
    // Show retro toast notification
    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'retro-toast';
        toast.textContent = `> ${message}`;
        document.body.appendChild(toast);
        
        this.playClick();
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    // Create retro progress bar
    createProgressBar(container, progress = 0) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'retro-progress';
        
        const bar = document.createElement('div');
        bar.className = 'retro-progress-bar';
        bar.style.width = `${progress}%`;
        
        progressDiv.appendChild(bar);
        container.appendChild(progressDiv);
        
        return {
            update: (newProgress) => {
                bar.style.width = `${newProgress}%`;
            },
            element: progressDiv
        };
    }
    
    // Type text with retro effect
    typeText(element, text, speed = 50) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                this.playClick();
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    // Create retro menu
    createMenu(items, container) {
        const menu = document.createElement('div');
        menu.className = 'retro-menu';
        
        items.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'retro-menu-item';
            menuItem.innerHTML = `[${index + 1}] ${item.label}`;
            menuItem.onclick = () => {
                this.playClick();
                item.action();
            };
            menu.appendChild(menuItem);
        });
        
        container.appendChild(menu);
    }
    
    // Create retro loading animation
    showLoading(container, message = 'LOADING') {
        const loading = document.createElement('div');
        loading.className = 'retro-loading-container';
        loading.innerHTML = `
            <div class="retro-ascii-header">
    ╔═══════════════════╗
    ║   PLEASE WAIT     ║
    ╚═══════════════════╝
            </div>
            <div class="retro-center retro-loading">${message}</div>
        `;
        container.appendChild(loading);
        
        return {
            remove: () => loading.remove()
        };
    }
    
    // ASCII art logo generator
    generateLogo(text) {
        // Simple block letters
        const letters = {
            'N': ['█▄ █', '█ ▀█'],
            'O': ['█▀█', '█▄█'],
            'V': ['█ █', '▀▄▀'],
            'A': ['▄▀█', '█▀█']
        };
        
        let line1 = '';
        let line2 = '';
        
        for (let char of text.toUpperCase()) {
            if (letters[char]) {
                line1 += letters[char][0] + ' ';
                line2 += letters[char][1] + ' ';
            }
        }
        
        return line1 + '\n' + line2;
    }
    
    // Terminal-style input with command history
    createTerminalInput(container, onCommand) {
        const terminal = document.createElement('div');
        terminal.className = 'retro-terminal';
        terminal.style.background = '#000';
        terminal.style.padding = '20px';
        terminal.style.fontFamily = 'monospace';
        
        const history = document.createElement('div');
        history.className = 'retro-terminal-history';
        
        const inputLine = document.createElement('div');
        inputLine.className = 'retro-terminal-input-line';
        inputLine.style.display = 'flex';
        inputLine.style.alignItems = 'center';
        
        const prompt = document.createElement('span');
        prompt.textContent = '> ';
        prompt.style.color = '#00ff00';
        prompt.style.marginRight = '10px';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'retro-input';
        input.style.background = 'transparent';
        input.style.border = 'none';
        input.style.flex = '1';
        input.style.outline = 'none';
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                if (command.trim()) {
                    this.addTerminalLine(history, `> ${command}`);
                    onCommand(command);
                    input.value = '';
                }
            }
        });
        
        inputLine.appendChild(prompt);
        inputLine.appendChild(input);
        terminal.appendChild(history);
        terminal.appendChild(inputLine);
        container.appendChild(terminal);
        
        input.focus();
        
        return {
            addLine: (text, className = '') => this.addTerminalLine(history, text, className),
            clear: () => history.innerHTML = '',
            focus: () => input.focus()
        };
    }
    
    addTerminalLine(container, text, className = '') {
        const line = document.createElement('div');
        line.className = `retro-terminal-line ${className}`;
        line.textContent = text;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }
}

// Initialize RetroUI globally
const Retro = new RetroUI();

// Export for use in products
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetroUI;
}