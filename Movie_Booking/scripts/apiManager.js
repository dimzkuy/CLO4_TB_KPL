// Centralized API Manager dengan Custom Popups untuk semua localhost:5000 calls
class APIManager {
    constructor() {
        if (APIManager.instance) {
            return APIManager.instance;
        }
        
        this.baseURL = 'http://localhost:5000';
        this.defaultTimeout = 10000; // 10 seconds
        
        APIManager.instance = this;
        return this;
    }
    
    static getInstance() {
        if (!APIManager.instance) {
            APIManager.instance = new APIManager();
        }
        return APIManager.instance;
    }
    
    // Show API loading popup
    showAPILoadingPopup(message = 'Menghubungi server...') {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay api-loading-overlay';
        overlay.innerHTML = `
            <div class="popup-modal api-loading-popup">
                <div class="popup-header" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%)">
                    <div class="loading-icon">🌐</div>
                    <h2 class="loading-title">Connecting to Server</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">${message}</p>
                    <div class="api-status">
                        <div class="server-indicator">
                            <span class="status-dot connecting"></span>
                            <span>localhost:5000</span>
                        </div>
                    </div>
                    <div class="loading-progress">
                        <div class="loading-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        return overlay;
    }
    
    // Show API success popup
    showAPISuccessPopup(message, data = null) {
        this.hideAPIPopup();
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay api-success-overlay';
        overlay.innerHTML = `
            <div class="popup-modal api-success-popup">
                <div class="popup-header" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%)">
                    <div class="welcome-icon">✅</div>
                    <h2 class="welcome-title">Server Response</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">${message}</p>
                    <div class="api-status">
                        <div class="server-indicator">
                            <span class="status-dot connected"></span>
                            <span>localhost:5000 - Connected</span>
                        </div>
                    </div>
                    ${data ? `<div class="api-data"><pre>${JSON.stringify(data, null, 2)}</pre></div>` : ''}
                    <button class="welcome-continue-btn" onclick="APIManager.getInstance().hideAPIPopup()">
                        Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        return overlay;
    }
    
    // Show API error popup
    showAPIErrorPopup(error, endpoint = '') {
        this.hideAPIPopup();
        
        let errorMessage = 'Unknown error occurred';
        let errorType = 'network';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Cannot connect to Flask server';
            errorType = 'connection';
        } else if (error.message) {
            errorMessage = error.message;
            errorType = 'api';
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay api-error-overlay';
        overlay.innerHTML = `
            <div class="popup-modal api-error-popup">
                <div class="popup-header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%)">
                    <div class="welcome-icon">❌</div>
                    <h2 class="welcome-title">Server Error</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">${errorMessage}</p>
                    <div class="api-status">
                        <div class="server-indicator">
                            <span class="status-dot disconnected"></span>
                            <span>localhost:5000 - ${errorType === 'connection' ? 'Disconnected' : 'Error'}</span>
                        </div>
                    </div>
                    ${endpoint ? `<div class="api-endpoint">Endpoint: ${endpoint}</div>` : ''}
                    <div class="error-actions">
                        <button class="welcome-continue-btn" onclick="APIManager.getInstance().hideAPIPopup()">
                            Close
                        </button>
                        ${errorType === 'connection' ? `
                        <button class="retry-btn" onclick="APIManager.getInstance().checkServerStatus()">
                            Check Server
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        return overlay;
    }
    
    // Hide API popups
    hideAPIPopup() {
        const popups = document.querySelectorAll('.api-loading-overlay, .api-success-overlay, .api-error-overlay');
        popups.forEach(popup => {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        });
    }
    
    // Generic API call with popups
    async makeAPICall(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const loadingPopup = this.showAPILoadingPopup(`Connecting to ${endpoint}...`);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Show success popup briefly
            this.showAPISuccessPopup('Request successful!', data);
            
            // Auto hide success popup after 2 seconds
            setTimeout(() => {
                this.hideAPIPopup();
            }, 2000);
            
            return data;
            
        } catch (error) {
            this.showAPIErrorPopup(error, endpoint);
            throw error;
        }
    }
    
    // Check server status
    async checkServerStatus() {
        try {
            const response = await this.makeAPICall('/api/health');
            if (response.success) {
                this.showAPISuccessPopup('Flask server is running!', response);
            }
        } catch (error) {
            this.showAPIErrorPopup(error, '/api/health');
        }
    }
    
    // Specific API methods
    async login(username, password) {
        return this.makeAPICall('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }
    
    async register(username, email, password) {
        return this.makeAPICall('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    }
    
    async checkUsernameAvailability(username) {
        return this.makeAPICall(`/api/check-username/${encodeURIComponent(username)}`);
    }
    
    async checkEmailAvailability(email) {
        return this.makeAPICall(`/api/check-email/${encodeURIComponent(email)}`);
    }
}

// Prevent modification
Object.freeze(APIManager);