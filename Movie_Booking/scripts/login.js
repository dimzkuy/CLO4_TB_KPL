// LOGIN SYSTEM dengan FINITE STATE AUTOMATA (Pure Logic) + Custom Popups

document.addEventListener('DOMContentLoaded', function () {
    
    // ✅ Check if user is already logged in
    try {
        const sessionManager = SessionManager.getInstance();
        const securityManager = SecurityManager.getInstance();
        
        if (sessionManager && sessionManager.isLoggedIn() && securityManager.isSessionValid()) {
            const currentUser = sessionManager.getCurrentUser();
            const username = currentUser ? currentUser.username : 'User';
            
            showLoginWarningDialog(username);
            return;
        }
    } catch (error) {
        console.log('No existing session found');
    }
    
    // ✅ FINITE STATE AUTOMATA Definition
    const LoginStates = {
        IDLE: 'idle',
        VALIDATING: 'validating',
        AUTHENTICATING: 'authenticating',
        AUTHENTICATED: 'authenticated',
        FAILED: 'failed',
        LOCKED: 'locked',
        ERROR: 'error'
    };
    
    // ✅ AUTOMATA: Current state dan transition tracking
    let currentState = LoginStates.IDLE;
    let stateHistory = [];
    let loginAttempts = 0;
    const maxAttempts = 3;
    let lockoutTimer = null;
    
    // ✅ AUTOMATA: State transition rules (Transition Table)
    const transitionTable = {
        [LoginStates.IDLE]: {
            'START_VALIDATION': LoginStates.VALIDATING,
            'RESET': LoginStates.IDLE
        },
        [LoginStates.VALIDATING]: {
            'VALIDATION_SUCCESS': LoginStates.AUTHENTICATING,
            'VALIDATION_FAILED': LoginStates.IDLE,
            'VALIDATION_ERROR': LoginStates.ERROR
        },
        [LoginStates.AUTHENTICATING]: {
            'AUTH_SUCCESS': LoginStates.AUTHENTICATED,
            'AUTH_FAILED': LoginStates.FAILED,
            'AUTH_ERROR': LoginStates.ERROR
        },
        [LoginStates.AUTHENTICATED]: {
            'LOGOUT': LoginStates.IDLE,
            'SESSION_EXPIRED': LoginStates.IDLE
        },
        [LoginStates.FAILED]: {
            'RETRY': LoginStates.IDLE,
            'MAX_ATTEMPTS_REACHED': LoginStates.LOCKED,
            'RESET': LoginStates.IDLE
        },
        [LoginStates.LOCKED]: {
            'UNLOCK_TIMEOUT': LoginStates.IDLE,
            'ADMIN_UNLOCK': LoginStates.IDLE
        },
        [LoginStates.ERROR]: {
            'RETRY': LoginStates.IDLE,
            'RESET': LoginStates.IDLE
        }
    };
    
    // ✅ AUTOMATA: State transition function
    function transition(event, data = null) {
        const validTransitions = transitionTable[currentState];
        
        // Check if transition is valid
        if (!validTransitions || !validTransitions[event]) {
            console.warn(`🚫 Invalid transition: ${event} from state ${currentState}`);
            return false;
        }
        
        const previousState = currentState;
        currentState = validTransitions[event];
        
        // Log state change
        const stateChange = {
            timestamp: new Date().toISOString(),
            from: previousState,
            to: currentState,
            event: event,
            data: data,
            attempts: loginAttempts
        };
        
        stateHistory.push(stateChange);
        
        // Console logging untuk debugging
        console.log(`🔄 LOGIN AUTOMATA: ${previousState} --[${event}]--> ${currentState}`);
        if (data) {
            console.log(`📊 Data:`, data);
        }
        
        // Execute state-specific actions
        executeStateAction(currentState, previousState, event, data);
        
        return true;
    }
    
    // ✅ CUSTOM POPUP FUNCTIONS
    function showWelcomePopup(userData) {
        // Remove any existing popups
        const existingPopup = document.querySelector('.popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-modal welcome-popup">
                <div class="popup-header">
                    <div class="welcome-icon">🎉</div>
                    <h2 class="welcome-title">Selamat Datang!</h2>
                    <p class="welcome-subtitle">Login berhasil</p>
                </div>
                <div class="popup-body">
                    <div class="welcome-user-info">
                        <div class="user-avatar">${userData.username.charAt(0).toUpperCase()}</div>
                        <h3 class="welcome-username">${userData.username}</h3>
                        <p class="welcome-email">${userData.email}</p>
                        <p class="login-time">Masuk pada: ${new Date().toLocaleString('id-ID')}</p>
                    </div>
                    <button class="welcome-continue-btn" onclick="continueToHome()">
                        Lanjutkan ke Beranda
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        // Global function untuk continue button
        window.continueToHome = function () {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                window.location.href = 'home.html';
            }, 300);
        };
    }
    
    function showLoadingPopup(message = 'Mengautentikasi...', steps = null) {
        // Remove any existing popups
        const existingPopup = document.querySelector('.popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const defaultSteps = [
            { text: 'Memvalidasi data...', icon: '⏳' },
            { text: 'Mengautentikasi...', icon: '🔐' },
            { text: 'Finalisasi...', icon: '✅' }
        ];
        
        const stepsToShow = steps || defaultSteps;
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay loading-overlay';
        overlay.innerHTML = `
            <div class="popup-modal loading-popup">
                <div class="popup-header">
                    <div class="loading-icon">⚙️</div>
                    <h2 class="loading-title">Memproses...</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">${message}</p>
                    <div class="loading-progress">
                        <div class="loading-progress-bar"></div>
                    </div>
                    <div class="loading-steps">
                        ${stepsToShow.map((step, index) => `
                            <div class="loading-step" data-step="${index}">
                                <span class="loading-step-icon">${step.icon}</span>
                                ${step.text}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        return overlay;
    }
    
    function updateLoadingStep(overlay, stepIndex) {
        if (!overlay) return;
        
        const steps = overlay.querySelectorAll('.loading-step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < stepIndex) {
                step.classList.add('completed');
                step.querySelector('.loading-step-icon').textContent = '✅';
            } else if (index === stepIndex) {
                step.classList.add('active');
            }
        });
    }
    
    function hideLoadingPopup(overlay) {
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 300);
        }
    }
    
    function showErrorPopup(message, type = 'error') {
        // Remove any existing popups
        const existingPopup = document.querySelector('.popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const icons = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const colors = {
            error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            warning: 'linear-gradient(135deg, #fd7e14 0%, #e66500 100%)',
            info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-modal">
                <div class="popup-header" style="background: ${colors[type]}">
                    <div class="welcome-icon">${icons[type]}</div>
                    <h2 class="welcome-title">${type === 'error' ? 'Terjadi Kesalahan' : type === 'warning' ? 'Peringatan' : 'Informasi'}</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">${message}</p>
                    <button class="welcome-continue-btn" onclick="closeErrorPopup()">
                        Tutup
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        // Auto close after 3 seconds for info messages
        if (type === 'info') {
            setTimeout(() => {
                if (overlay.parentNode) {
                    closeErrorPopup();
                }
            }, 3000);
        }
        
        // Global function untuk close button
        window.closeErrorPopup = function () {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 300);
        };
        
        return overlay;
    }
    
    function showLockoutPopup(countdown) {
        // Remove any existing popups
        const existingPopup = document.querySelector('.popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-modal">
                <div class="popup-header" style="background: linear-gradient(135deg, #6f42c1 0%, #5a359a 100%)">
                    <div class="welcome-icon">🔒</div>
                    <h2 class="welcome-title">Akun Terkunci</h2>
                </div>
                <div class="popup-body">
                    <p class="loading-message">Terlalu banyak percobaan login yang gagal.</p>
                    <div class="logout-info">
                        <p><strong>Akun akan terbuka dalam:</strong></p>
                        <p class="countdown-display" style="font-size: 2rem; color: #ffc107; font-weight: bold; text-align: center; margin: 15px 0;">
                            <span id="lockout-countdown">${countdown}</span> detik
                        </p>
                    </div>
                    <div class="loading-progress">
                        <div class="loading-progress-bar" id="lockout-progress" style="animation: none; width: 100%;"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 100);
        
        return overlay;
    }
    
    function updateLockoutCountdown(overlay, remaining, total) {
        if (!overlay) return;
        
        const countdownEl = overlay.querySelector('#lockout-countdown');
        const progressEl = overlay.querySelector('#lockout-progress');
        
        if (countdownEl) {
            countdownEl.textContent = remaining;
        }
        
        if (progressEl) {
            const percentage = (remaining / total) * 100;
            progressEl.style.width = `${percentage}%`;
        }
    }
    
    // ✅ AUTOMATA: State action handler
    function executeStateAction(state, previousState, event, data) {
        switch (state) {
            case LoginStates.IDLE:
                handleIdleState(previousState, event);
                break;
            case LoginStates.VALIDATING:
                handleValidatingState(data);
                break;
            case LoginStates.AUTHENTICATING:
                handleAuthenticatingState(data);
                break;
            case LoginStates.AUTHENTICATED:
                handleAuthenticatedState(data);
                break;
            case LoginStates.FAILED:
                handleFailedState(data);
                break;
            case LoginStates.LOCKED:
                handleLockedState();
                break;
            case LoginStates.ERROR:
                handleErrorState(data);
                break;
        }
    }
    
    // ✅ STATE HANDLERS dengan Custom Popups
    function handleIdleState(previousState, event) {
        console.log('📝 STATE: IDLE - Ready for login');
        updateButtonText('Masuk');
        enableForm();
        
        // Hide any loading popups
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            hideLoadingPopup(loadingOverlay);
        }
        
        if (previousState === LoginStates.FAILED && event === 'RETRY') {
            showErrorPopup('Silakan coba lagi', 'info');
        }
    }
      
    function handleValidatingState(data) {
        console.log('🔍 STATE: VALIDATING - Checking form inputs');
        updateButtonText('Memvalidasi...');
        disableForm();
        
        // ✅ No popup during validation - silent validation only
    }
    
    function handleAuthenticatingState(data) {
        console.log('🔐 STATE: AUTHENTICATING - Verifying credentials');
        updateButtonText('Mengautentikasi...');
        disableForm();
        
        // ✅ No loading popup - just silent authentication
    }
    
    function handleAuthenticatedState(data) {
        console.log('✅ STATE: AUTHENTICATED - Login successful');
        updateButtonText('Berhasil!');
        
        // ✅ Langsung tampilkan welcome popup tanpa loading
        showWelcomePopup(data);
        
        // Store session
        localStorage.setItem('currentUser', JSON.stringify({
            username: data.username,
            email: data.email,
            loginTime: new Date().toISOString(),
            loginAttempts: loginAttempts
        }));
    }
    
    function handleFailedState(data) {
        console.log('❌ STATE: FAILED - Authentication failed');
        loginAttempts++;
        
        const remainingAttempts = maxAttempts - loginAttempts;
        
        updateButtonText('Gagal - Coba Lagi');
        enableForm();
        
        if (remainingAttempts > 0) {
            showErrorPopup(`Login gagal. Sisa ${remainingAttempts} percobaan`, 'error');
            
            // Auto transition to RETRY after 2 seconds
            setTimeout(() => {
                transition('RETRY');
            }, 2000);
        } else {
            showErrorPopup('Terlalu banyak percobaan gagal. Akun akan dikunci.', 'warning');
            
            // Transition to locked state
            setTimeout(() => {
                transition('MAX_ATTEMPTS_REACHED');
            }, 1000);
        }
    }
    
    function handleLockedState() {
        console.log('🔒 STATE: LOCKED - Account temporarily locked');
        
        updateButtonText('Akun Terkunci');
        disableForm();
        
        // Show lockout popup
        const lockoutTime = 30;
        const lockoutOverlay = showLockoutPopup(lockoutTime);
        
        // Start lockout countdown
        let countdown = lockoutTime;
        const countdownInterval = setInterval(() => {
            countdown--;
            updateButtonText(`Terkunci (${countdown}s)`);
            updateLockoutCountdown(lockoutOverlay, countdown, lockoutTime);
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                loginAttempts = 0; // Reset attempts
                
                // Hide lockout popup
                if (lockoutOverlay) {
                    hideLoadingPopup(lockoutOverlay);
                }
                
                // Transition to unlocked
                transition('UNLOCK_TIMEOUT');
                
                // Show success message
                setTimeout(() => {
                    showErrorPopup('Akun telah dibuka. Silakan coba lagi.', 'info');
                }, 300);
            }
        }, 1000);
    }
    
    function handleErrorState(data) {
        console.log('💥 STATE: ERROR - System error occurred');
        updateButtonText('Terjadi Kesalahan');
        enableForm();
        
        // Hide loading popup
        const loadingOverlay = window.currentLoadingOverlay;
        if (loadingOverlay) {
            hideLoadingPopup(loadingOverlay);
        }
        
        showErrorPopup('Terjadi kesalahan sistem. Silakan coba lagi.', 'error');
        
        // Auto retry after delay
        setTimeout(() => {
            transition('RETRY');
        }, 3000);
    }
    
    // ✅ UTILITY FUNCTIONS
    function updateButtonText(text) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = text;
        }
    }
    
    function disableForm() {
        const form = document.getElementById('loginForm');
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(input => input.disabled = true);
    }
    
    function enableForm() {
        const form = document.getElementById('loginForm');
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(input => input.disabled = false);
    }
    
    // ✅ DEPRECATED: Keep for backward compatibility
    function showMessage(message, type) {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Now using custom popups instead of alerts
        if (type === 'success') {
            showErrorPopup(message, 'info');
        } else {
            showErrorPopup(message, type);
        }
    }
    
    // ✅ AUTOMATA: Debugging functions
    function getCurrentState() {
        return currentState;
    }
    
    function getStateHistory() {
        return stateHistory;
    }
    
    function getValidTransitions() {
        return Object.keys(transitionTable[currentState] || {});
    }
    
    function resetAutomata() {
        currentState = LoginStates.IDLE;
        stateHistory = [];
        loginAttempts = 0;
        if (lockoutTimer) {
            clearTimeout(lockoutTimer);
            lockoutTimer = null;
        }
        
        // Clean up any existing popups
        const popups = document.querySelectorAll('.popup-overlay');
        popups.forEach(popup => popup.remove());
        
        console.log('🔄 Automata reset to IDLE state');
    }
    
    // ✅ MAIN LOGIN LOGIC
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!loginForm || !usernameInput || !passwordInput) {
        console.error('Required login elements not found');
        return;
    }
    
    // Initialize automata
    transition('RESET');
    
    // ✅ FORM SUBMISSION dengan Automata
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Check if we can start login process
        if (currentState !== LoginStates.IDLE) {
            console.warn(`Cannot start login from state: ${currentState}`);
            return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Start validation
        if (!transition('START_VALIDATION', { username, password })) {
            return;
        }
        
        try {
            // Basic form validation
            if (!username || !password) {
                transition('VALIDATION_FAILED', { error: 'Username dan password harus diisi' });
                showErrorPopup('Username dan password harus diisi', 'error');
                return;
            }
            
            if (username.length < 3) {
                transition('VALIDATION_FAILED', { error: 'Username minimal 3 karakter' });
                showErrorPopup('Username minimal 3 karakter', 'error');
                return;
            }
            
            // Validation success - move to authentication
            if (!transition('VALIDATION_SUCCESS', { username, password })) {
                return;
            }
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Load users data
            const response = await fetch('../data/usersData.json');
            if (!response.ok) {
                transition('AUTH_ERROR', { error: 'Gagal memuat data pengguna', type: 'network' });
                return;
            }
            
            const data = await response.json();
            const user = data.users.find(u =>
                (u.username === username || u.email === username) && u.password === password
            );
            
            if (user) {
                // Authentication successful
                transition('AUTH_SUCCESS', {
                    username: user.username,
                    email: user.email,
                    loginMethod: 'credentials'
                });
            } else {
                // Authentication failed
                transition('AUTH_FAILED', {
                    error: 'Username/email atau password salah',
                    username: username
                });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            transition('AUTH_ERROR', {
                error: error.message,
                type: 'system_error'
            });
        }
    });
            
});

// ✅ FUNCTION: Warning dialog untuk login page
function showLoginWarningDialog(username) {
    const overlay = document.createElement('div');
    overlay.className = 'warning-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 450px;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        animation: modalSlideIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">👤</div>
        <h3 style="color: #333; margin-bottom: 15px; font-size: 22px;">Sudah Login</h3>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
            Anda sudah login sebagai <strong style="color: #007bff;">"${username}"</strong>. 
            Apakah ingin melanjutkan atau login dengan user yang berbeda?
        </p>
        
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="continueAsCurrentUser" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">
                Lanjutkan sebagai ${username}
            </button>
            
            <button id="switchUser" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            ">
                Ganti User
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('continueAsCurrentUser').addEventListener('click', function() {
        overlay.remove();
        window.location.href = 'home.html';
    });
    
    document.getElementById('switchUser').addEventListener('click', function() {
        overlay.remove();
        // Clear session and allow new login
        try {
            const sessionManager = SessionManager.getInstance();
            sessionManager.logout();
        } catch (error) {
            localStorage.clear();
            sessionStorage.clear();
        }
        // Stay on login page for new login
        location.reload();
    });
}

