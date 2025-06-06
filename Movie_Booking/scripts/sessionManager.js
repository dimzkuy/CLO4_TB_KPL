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
        // If sessionStorage doesn't have the init flag, it's a fresh session
        if (!sessionStorage.getItem(this.sessionInitKey)) {
            // Clear any stored login data from previous browser sessions
            localStorage.removeItem(this.sessionKey);
            // Mark this session as initialized
            sessionStorage.setItem(this.sessionInitKey, 'true');
        }
    }
    
    // Login user
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem(this.sessionKey, JSON.stringify(userData));
        this.notifyObservers('login', userData);
    }
    
    // Logout user
    logout() {
        const oldUser = this.currentUser;
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        this.notifyObservers('logout', oldUser);
    }
    
    // Check if user is logged in
    isLoggedIn() {
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
                this.currentUser = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Error loading session:', error);
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
        this.currentUser = { ...this.currentUser, ...userData };
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
        this.notifyObservers('update', this.currentUser);
    }
}

// Prevent modification
Object.freeze(SessionManager);