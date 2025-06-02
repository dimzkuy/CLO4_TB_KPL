class SecurityManager {
    constructor() {
        if (SecurityManager.instance) {
            return SecurityManager.instance;
        }
        
        this.salt = 'CinemaBook2025!@#';
        this.maxLoginAttempts = 3;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        
        SecurityManager.instance = this;
        return this;
    }
    
    static getInstance() {
        if (!SecurityManager.instance) {
            SecurityManager.instance = new SecurityManager();
        }
        return SecurityManager.instance;
    }
    
    // Hash password with salt
    async hashPassword(password) {
        // Simple hash implementation (dalam production gunakan bcrypt)
        const saltedPassword = password + this.salt;
        const encoder = new TextEncoder();
        const data = encoder.encode(saltedPassword);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    // Validate password strength
    validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`Password minimal ${minLength} karakter`);
        }
        if (!hasUpperCase) {
            errors.push('Password harus mengandung huruf besar');
        }
        if (!hasLowerCase) {
            errors.push('Password harus mengandung huruf kecil');
        }
        if (!hasNumbers) {
            errors.push('Password harus mengandung angka');
        }
        if (!hasSpecialChar) {
            errors.push('Password harus mengandung karakter khusus');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            strength: this.calculatePasswordStrength(password)
        };
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length bonus
        score += Math.min(password.length * 4, 25);
        
        // Character variety bonus
        if (/[a-z]/.test(password)) score += 5;
        if (/[A-Z]/.test(password)) score += 5;
        if (/[0-9]/.test(password)) score += 5;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;
        
        // Pattern penalties
        if (/(.)\1{2,}/.test(password)) score -= 10; // Repeating chars
        if (/123|abc|qwe/i.test(password)) score -= 10; // Common patterns
        
        if (score < 30) return 'Lemah';
        if (score < 60) return 'Sedang';
        if (score < 80) return 'Kuat';
        return 'Sangat Kuat';
    }
    
    // Input sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>'"]/g, '') // Remove potential XSS chars
            .substring(0, 100); // Limit length
    }
    
    // Email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Username validation
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
    
    // Enhanced login attempt tracking
    checkLoginAttempts(username) {
        const attemptsKey = `login_attempts_${username}`;
        const lockoutKey = `lockout_${username}`;
        const lastAttemptKey = `last_attempt_${username}`;
        
        // Check if account is currently locked
        const lockoutTime = localStorage.getItem(lockoutKey);
        if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
            const remainingTime = Math.ceil((parseInt(lockoutTime) - Date.now()) / 60000);
            return {
                allowed: false,
                message: `Akun terkunci karena terlalu banyak percobaan login gagal. Coba lagi dalam ${remainingTime} menit.`,
                isLocked: true
            };
        }
        
        // Check rate limiting (prevent brute force)
        const lastAttempt = localStorage.getItem(lastAttemptKey);
        if (lastAttempt && Date.now() - parseInt(lastAttempt) < 2000) { // 2 second delay
            return {
                allowed: false,
                message: 'Mohon tunggu sebentar sebelum mencoba lagi.',
                isRateLimit: true
            };
        }
        
        const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
        
        if (attempts >= this.maxLoginAttempts) {
            // Lock account
            const lockoutDuration = this.lockoutTime;
            localStorage.setItem(lockoutKey, (Date.now() + lockoutDuration).toString());
            localStorage.removeItem(attemptsKey);
            
            return {
                allowed: false,
                message: `Akun dikunci selama 15 menit karena terlalu banyak percobaan login gagal.`,
                isLocked: true
            };
        }
        
        return { 
            allowed: true, 
            attempts: attempts,
            remainingAttempts: this.maxLoginAttempts - attempts
        };
    }
    
    // Record failed login with timestamp
    recordFailedLogin(username) {
        const attemptsKey = `login_attempts_${username}`;
        const lastAttemptKey = `last_attempt_${username}`;
        
        const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');
        localStorage.setItem(attemptsKey, (currentAttempts + 1).toString());
        localStorage.setItem(lastAttemptKey, Date.now().toString());
        
        // Log security event (in production, send to security monitoring)
        console.warn(`Failed login attempt for user: ${username}, attempt: ${currentAttempts + 1}`);
    }
    
    // Clear login attempts on successful login
    clearLoginAttempts(username) {
        localStorage.removeItem(`login_attempts_${username}`);
        localStorage.removeItem(`lockout_${username}`);
    }
    
    // Generate secure session token
    generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Session timeout management
    setSessionTimeout(duration = 30 * 60 * 1000) { // 30 minutes default
        const expiryTime = Date.now() + duration;
        localStorage.setItem('sessionExpiry', expiryTime.toString());
    }
    
    isSessionValid() {
        const expiry = localStorage.getItem('sessionExpiry');
        if (!expiry) return false;
        
        return Date.now() < parseInt(expiry);
    }
    
    // Secure data storage
    encryptData(data) {
        // Simple encryption (dalam production gunakan proper encryption)
        try {
            return btoa(JSON.stringify(data));
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }
    
    decryptData(encryptedData) {
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
    
    // Enhanced session validation
    validateSession() {
        const sessionManager = SessionManager.getInstance();
        
        if (!sessionManager.isLoggedIn()) {
            return { valid: false, reason: 'not_logged_in' };
        }
        
        if (!this.isSessionValid()) {
            return { valid: false, reason: 'session_expired' };
        }
        
        // Update last activity
        const currentUser = sessionManager.getCurrentUser();
        if (currentUser) {
            currentUser.lastActivity = new Date().toISOString();
            sessionManager.updateUser(currentUser);
        }
        
        return { valid: true };
    }
    
    // Security logging (in production, send to server)
    logSecurityEvent(event, username, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            username: username,
            userAgent: navigator.userAgent,
            ip: 'client-side', // In production, get from server
            details: details
        };
        
        console.log('Security Event:', logEntry);
        
        // In production, send to security monitoring system
        // await fetch('/api/security/log', { method: 'POST', body: JSON.stringify(logEntry) });
    }
}

Object.freeze(SecurityManager);