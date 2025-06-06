// Warning Dialog System
class WarningDialog {
    constructor() {
        this.currentOverlay = null;
    }

    checkSessionAndRedirect(page) {
        // Check if user is already logged in
        const currentUser = localStorage.getItem('currentUser') || 
                           sessionStorage.getItem('currentUser') ||
                           localStorage.getItem('userSession');
        
        if (currentUser) {
            let userData;
            try {
                userData = JSON.parse(currentUser);
            } catch (error) {
                userData = { username: 'User' };
            }
            
            const username = userData.username || userData.name || 'User';
            this.showWarningDialog(username, page);
        } else {
            // No session, redirect normally
            window.location.href = page + '.html';
        }
    }

    showWarningDialog(username, targetPage) {
        // Remove existing dialog if any
        this.cleanup();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'warning-overlay';
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'warning-modal';
        
        const pageText = targetPage === 'register' ? 'mendaftar akun baru' : 'login';
        const actionText = targetPage === 'register' ? 'Daftar Akun Baru' : 'Login User Lain';
        const actionClass = targetPage === 'register' ? 'warning-btn-danger' : 'warning-btn-primary';
        
        modal.innerHTML = `
            <div class="warning-icon">⚠️</div>
            <h3 class="warning-title">Anda Sudah Login</h3>
            <p class="warning-message">
                Anda sudah login sebagai <span class="warning-username">"${username}"</span>.<br>
                Apakah ingin melanjutkan atau ${pageText}?
            </p>
            
            <div class="warning-buttons">
                <button id="continueAsUser" class="warning-btn warning-btn-primary">
                    Lanjutkan sebagai ${username}
                </button>
                
                <button id="switchUser" class="warning-btn ${actionClass}">
                    ${actionText}
                </button>
            </div>
            
            <div class="warning-footer">
                <p class="warning-footer-text">
                </p>
                <button id="closeDialog" class="warning-btn warning-btn-secondary" style="margin-top: 10px;">
                    Batal
                </button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        this.currentOverlay = overlay;
        
        // Add event listeners
        this.attachEventListeners(targetPage);
    }

    attachEventListeners(targetPage) {
        const continueBtn = document.getElementById('continueAsUser');
        const switchBtn = document.getElementById('switchUser');
        const closeBtn = document.getElementById('closeDialog');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.cleanup();
                window.location.href = 'home.html';
            });
        }
        
        if (switchBtn) {
            switchBtn.addEventListener('click', () => {
                this.cleanup();
                this.logoutAndRedirect(targetPage);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.cleanup();
            });
        }
        
        // Close on overlay click
        if (this.currentOverlay) {
            this.currentOverlay.addEventListener('click', (e) => {
                if (e.target === this.currentOverlay) {
                    this.cleanup();
                }
            });
        }

        // ESC key to close
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        if (e.key === 'Escape' && this.currentOverlay) {
            this.cleanup();
        }
    }

    logoutAndRedirect(targetPage) {
        // Clear all session data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userSession');
        sessionStorage.clear();
        
        // Show logout notification
        const message = targetPage === 'register' ? 
            'Logout berhasil. Silakan daftar akun baru.' : 
            'Logout berhasil. Silakan login dengan akun lain.';
            
        this.showNotification(message, 'success');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = targetPage + '.html';
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    cleanup() {
        if (this.currentOverlay) {
            this.currentOverlay.remove();
            this.currentOverlay = null;
        }
        
        // Remove keydown listener
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
}

// Initialize warning dialog system
const warningDialog = new WarningDialog();

// Global functions for backward compatibility
window.checkSessionAndRedirect = function(page) {
    warningDialog.checkSessionAndRedirect(page);
};

window.showWarningDialog = function(username, targetPage) {
    warningDialog.showWarningDialog(username, targetPage);
};

window.logoutAndRedirect = function(targetPage) {
    warningDialog.logoutAndRedirect(targetPage);
};

window.showNotification = function(message, type) {
    warningDialog.showNotification(message, type);
};