// Singleton untuk mengelola session user
class SessionManager {
    constructor() {
        if (SessionManager.instance) {
            return SessionManager.instance;
        }
        
        this.currentUser = null;
        this.sessionKey = 'currentUser';
        this.sessionInitKey = 'sessionInitialized';
        this.observers = [];
        
        // Check if this is a fresh browser session
        this.checkFreshSession();
        
        // Load existing session
        this.loadSession();
        
        SessionManager.instance = this;
        return this;
    }
    
    // Static method untuk mendapatkan instance
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    
    // Check if this is a fresh browser session
    checkFreshSession() {
        // Use a combination of sessionStorage and a timestamp to detect fresh browser sessions
        const browserSessionKey = 'browserSessionId';
        const sessionTimestamp = 'sessionTimestamp';
        
        // Get current browser session ID and timestamp
        const currentBrowserSession = sessionStorage.getItem(browserSessionKey);
        const lastSessionTime = localStorage.getItem(sessionTimestamp);
        
        // If no browser session ID exists, this is a fresh browser start
        if (!currentBrowserSession) {
            // Generate a unique browser session ID
            const newSessionId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(browserSessionKey, newSessionId);
            
            // Check if this is truly a fresh browser start (not just a new tab)
            const now = Date.now();
            const timeDiff = lastSessionTime ? now - parseInt(lastSessionTime) : Infinity;
            
            // If more than 5 minutes have passed since last session, consider it a fresh browser start
            if (timeDiff > 5 * 60 * 1000 || !lastSessionTime) {
                console.log('Fresh browser session detected, clearing old login data');
                localStorage.removeItem(this.sessionKey);
                this.currentUser = null;
            } else {
                console.log('New tab/window detected, preserving session');
            }
            
            // Update session timestamp
            localStorage.setItem(sessionTimestamp, now.toString());
        }
        
        // Mark this session as initialized
        sessionStorage.setItem(this.sessionInitKey, 'true');
        
        // Update session timestamp on every page load (for tab tracking)
        localStorage.setItem(sessionTimestamp, Date.now().toString());
    }
    
    // Login user
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem(this.sessionKey, JSON.stringify(userData));
        this.notifyObservers('login', userData);
    }
    
    // Logout user
    logout() {
        console.log('SessionManager: Starting logout process...');
        const oldUser = this.currentUser;
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('sessionTimestamp'); // Clear timestamp on logout
        sessionStorage.clear(); // Clear all session data including browser session ID
        
        console.log('SessionManager: User data cleared, notifying observers...');
        this.notifyObservers('logout', oldUser);
        
        // Additional backup redirect
        setTimeout(() => {
            if (!window.location.pathname.includes('landing_page')) {
                console.log('SessionManager backup: Redirecting to landing page...');
                window.location.replace('landing_page.html');
            }
        }, 3000);
    }
    
    // Check if user is logged in
    isLoggedIn() {
        // Double check with stored data
        if (!this.currentUser) {
            this.loadSession();
        }
        return this.currentUser !== null;
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Load session from localStorage
    loadSession() {
        try {
            const storedUser = localStorage.getItem(this.sessionKey);
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                // Validate user data structure
                if (userData && userData.username) {
                    this.currentUser = userData;
                } else {
                    // Invalid user data, clear it
                    localStorage.removeItem(this.sessionKey);
                    this.currentUser = null;
                }
            } else {
                this.currentUser = null;
            }
        } catch (error) {
            console.error('Error loading session:', error);
            localStorage.removeItem(this.sessionKey);
            this.currentUser = null;
        }
    }
    
    // Observer pattern untuk notifikasi perubahan session
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    notifyObservers(action, data) {
        this.observers.forEach(callback => callback(action, data));
    }
    
    // Update user data
    updateUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            this.notifyObservers('update', this.currentUser);
        }
    }
    
    // Clear all session data (for complete logout)
    clearAllSessionData() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        sessionStorage.clear();
    }
}

// Prevent modification
Object.freeze(SessionManager);