// PRODUCTION VERSION - Using Express API (No Password Strength)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Singletons
    let securityManager, sessionManager, notificationManager;
    
    try {
        securityManager = SecurityManager.getInstance();
        sessionManager = SessionManager.getInstance();
        notificationManager = NotificationManager.getInstance();
        
        console.log('Registration Singletons initialized successfully');
    } catch (error) {
        console.error('Singleton initialization failed:', error);
        initializeFallbackRegister();
        return;
    }
    
    // Check if user is already logged in
    if (sessionManager && sessionManager.isLoggedIn() && securityManager.isSessionValid()) {
        window.location.href = 'home.html';
        return;
    }
    
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!registerForm || !usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Required form elements not found');
        return;
    }
    
    // ✅ SECURE CODING: Real-time validation dengan CSS styling
    usernameInput.addEventListener('input', function() {
        this.value = securityManager.sanitizeInput(this.value);
        validateUsernameField();
    });
    
    emailInput.addEventListener('input', function() {
        this.value = securityManager.sanitizeInput(this.value);
        validateEmailField();
    });
    
    passwordInput.addEventListener('input', function() {
        validatePasswordField();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        validateConfirmPasswordField();
    });
    
    // ✅ SECURE CODING: Username validation
    function validateUsernameField() {
        const username = usernameInput.value;
        
        if (username.length > 0) {
            if (!securityManager.validateUsername(username)) {
                showFieldError(usernameInput, 'Username hanya boleh huruf, angka, underscore (3-20 karakter)');
                return false;
            } else {
                showFieldSuccess(usernameInput, 'Format username valid');
                return true;
            }
        } else {
            clearFieldState(usernameInput);
            return false;
        }
    }
    
    // ✅ SECURE CODING: Email validation
    function validateEmailField() {
        const email = emailInput.value;
        
        if (email.length > 0) {
            if (!securityManager.validateEmail(email)) {
                showFieldError(emailInput, 'Format email tidak valid');
                return false;
            } else {
                showFieldSuccess(emailInput, 'Format email valid');
                return true;
            }
        } else {
            clearFieldState(emailInput);
            return false;
        }
    }
    
    // ✅ SECURE CODING: Password validation (Simplified - No Strength Meter)
    function validatePasswordField() {
        const password = passwordInput.value;
        
        if (password.length > 0) {
            const validation = securityManager.validatePasswordStrength(password);
            
            if (!validation.isValid) {
                showFieldError(passwordInput, validation.errors[0]);
                return false;
            } else {
                showFieldSuccess(passwordInput, 'Password valid');
                return true;
            }
        } else {
            clearFieldState(passwordInput);
            return false;
        }
    }
    
    // ✅ SECURE CODING: Confirm password validation
    function validateConfirmPasswordField() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                showFieldError(confirmPasswordInput, 'Password tidak cocok');
                return false;
            } else {
                showFieldSuccess(confirmPasswordInput, 'Password cocok');
                return true;
            }
        } else {
            clearFieldState(confirmPasswordInput);
            return false;
        }
    }
    
    // ✅ CSS: Enhanced field styling
    function showFieldError(field, message) {
        clearFieldState(field);
        
        field.classList.add('error');
        
        const validationIcon = field.parentNode.querySelector('.validation-icon');
        if (validationIcon) {
            validationIcon.className = 'validation-icon error';
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function showFieldSuccess(field, message = '') {
        clearFieldState(field);
        
        field.classList.add('success');
        
        const validationIcon = field.parentNode.querySelector('.validation-icon');
        if (validationIcon) {
            validationIcon.className = 'validation-icon success';
        }
        
        if (message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'field-success';
            successDiv.textContent = message;
            field.parentNode.appendChild(successDiv);
        }
    }
    
    function clearFieldState(field) {
        field.classList.remove('error', 'success', 'warning');
        
        const validationIcon = field.parentNode.querySelector('.validation-icon');
        if (validationIcon) {
            validationIcon.className = 'validation-icon';
        }
        
        const existingMessage = field.parentNode.querySelector('.field-error, .field-success, .field-warning');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    // ✅ PRODUCTION: Form submission dengan Express API
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isUsernameValid = validateUsernameField();
        const isEmailValid = validateEmailField();
        const isPasswordValid = validatePasswordField();
        const isConfirmPasswordValid = validateConfirmPasswordField();
        
        if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            notificationManager.error('Mohon perbaiki kesalahan pada form');
            return;
        }
        
        try {
            // ✅ CSS: Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Memproses registrasi...';
            submitBtn.disabled = true;
            
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            
            // ✅ PRODUCTION: Send to Express API
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // ✅ SUCCESS: Registration berhasil
                console.log('✅ Registration successful:', result);
                
                // ✅ SECURE CODING: Log successful registration event
                securityManager.logSecurityEvent('user_registration', username, {
                    email: email,
                    registrationMethod: 'web_form',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                
                notificationManager.success(`Registrasi berhasil! Akun "${username}" telah dibuat.`);
                
                // ✅ PERBAIKAN: Clear form tapi JANGAN auto login
                registerForm.reset();
                
                // ✅ PERBAIKAN: Redirect ke login page, bukan home
                setTimeout(() => {
                    window.location.href = 'login.html'; // Bukan 'home.html'
                }, 2000); // Kurangi delay jadi 2 detik
                
            } else {
                // ✅ HANDLE API ERRORS
                console.log('❌ Registration failed:', result);
                
                if (result.message.includes('Username sudah terdaftar')) {
                    showFieldError(usernameInput, 'Username sudah terdaftar');
                    notificationManager.error('Username sudah digunakan');
                } else if (result.message.includes('Email sudah terdaftar')) {
                    showFieldError(emailInput, 'Email sudah terdaftar');
                    notificationManager.error('Email sudah terdaftar');
                } else {
                    notificationManager.error(result.message || 'Registrasi gagal');
                }
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // ✅ SECURE CODING: Handle network errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                notificationManager.error('Gagal terhubung ke server. Pastikan server berjalan di port 3000.');
            } else {
                notificationManager.error('Terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.');
            }
            
            // ✅ SECURE CODING: Log error event
            securityManager.logSecurityEvent('registration_error', usernameInput.value, {
                error: error.message,
                type: 'network_error'
            });
            
        } finally {
            // Restore button state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // ✅ PRODUCTION: Show registration summary
    function showRegistrationSummary(username, email) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'registration-summary';
        summaryDiv.innerHTML = `
            <h4>🎉 Registrasi Berhasil!</h4>
            <div class="summary-details">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Status:</strong> <span class="status-active">Aktif</span></p>
            </div>
            <div class="success-note">
                <p><strong>✅ Data berhasil disimpan ke database!</strong></p>
                <p>Anda akan dialihkan ke halaman login dalam beberapa detik.</p>
            </div>
        `;
        
        // Insert before form
        const authForm = document.querySelector('.auth-form');
        authForm.insertBefore(summaryDiv, registerForm);
        
        // Hide form
        registerForm.style.display = 'none';
    }
    
    // ✅ SECURE CODING: Real-time username availability check (debounced)
    let usernameCheckTimeout;
    usernameInput.addEventListener('input', function() {
        clearTimeout(usernameCheckTimeout);
        usernameCheckTimeout = setTimeout(async () => {
            const username = this.value;
            if (username.length >= 3 && securityManager.validateUsername(username)) {
                await checkUsernameAvailability(username);
            }
        }, 500);
    });
    
    async function checkUsernameAvailability(username) {
        try {
            // ✅ PRODUCTION: Check via API instead of direct JSON access
            const response = await fetch('../data/users.json');
            if (!response.ok) return;
            
            const data = await response.json();
            const existingUser = data.users.find(u => u.username === username);
            
            if (existingUser) {
                showFieldError(usernameInput, 'Username sudah digunakan');
            } else {
                showFieldSuccess(usernameInput, 'Username tersedia');
            }
        } catch (error) {
            console.error('Username check error:', error);
        }
    }
    
    // ✅ SECURE CODING: Real-time email availability check (debounced)
    let emailCheckTimeout;
    emailInput.addEventListener('input', function() {
        clearTimeout(emailCheckTimeout);
        emailCheckTimeout = setTimeout(async () => {
            const email = this.value;
            if (email.length > 0 && securityManager.validateEmail(email)) {
                await checkEmailAvailability(email);
            }
        }, 500);
    });
    
    async function checkEmailAvailability(email) {
        try {
            // ✅ PRODUCTION: Check via API instead of direct JSON access
            const response = await fetch('../data/users.json');
            if (!response.ok) return;
            
            const data = await response.json();
            const existingUser = data.users.find(u => u.email === email);
            
            if (existingUser && email !== '') {
                showFieldError(emailInput, 'Email sudah terdaftar');
            } else {
                showFieldSuccess(emailInput, 'Email tersedia');
            }
        } catch (error) {
            console.error('Email check error:', error);
        }
    }
});

// ✅ FALLBACK IMPLEMENTATION untuk jika server tidak berjalan
function initializeFallbackRegister() {
    console.log('Using fallback register implementation');
    
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!registerForm || !usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Required form elements not found');
        return;
    }
    
    // Check if already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }
    
    // Simple validation
    function validateForm() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!username || username.length < 3) {
            showAlert('Username minimal 3 karakter', 'error');
            return false;
        }
        
        if (!email || !email.includes('@')) {
            showAlert('Email tidak valid', 'error');
            return false;
        }
        
        if (!password || password.length < 8) {
            showAlert('Password minimal 8 karakter', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            showAlert('Password tidak cocok', 'error');
            return false;
        }
        
        return true;
    }
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Memeriksa data...';
            submitBtn.disabled = true;
            
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Try API first
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        email: email
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert('Registrasi berhasil!', 'success');
                    registerForm.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                    return;
                } else {
                    showAlert(result.message || 'Registrasi gagal', 'error');
                    return;
                }
            } catch (apiError) {
                console.log('API not available, showing instruction');
                showAlert('Server tidak berjalan. Silakan jalankan server Express terlebih dahulu.', 'error');
                return;
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('Terjadi kesalahan sistem. Silakan coba lagi.', 'error');
        } finally {
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Daftar Sekarang';
            submitBtn.disabled = false;
        }
    });
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-message">${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}