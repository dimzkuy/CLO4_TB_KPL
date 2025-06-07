// Global variables untuk testing
let sessionManager, movieManager, notificationManager;

// Initialize singletons when DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Singletons...');
    
    try {
        // Initialize Singleton instances
        sessionManager = SessionManager.getInstance();
        movieManager = MovieManager.getInstance();
        notificationManager = NotificationManager.getInstance();
        
        console.log('Singletons initialized:', {
            sessionManager: !!sessionManager,
            movieManager: !!movieManager,
            notificationManager: !!notificationManager
        });
        
        // Test if same instance
        const testSession = SessionManager.getInstance();
        console.log('Singleton test - Same instance?', sessionManager === testSession);
        
        // Cek apakah user sudah login
        if (!sessionManager.isLoggedIn()) {
            console.log('User not logged in, redirecting...');
            window.location.href = 'login.html';
            return;
        }
        
        const currentUser = sessionManager.getCurrentUser();
        console.log('Current user from Singleton:', currentUser);
        
        // Update tampilan user di navbar
        updateUserDisplay(currentUser);
        
        // Setup observer untuk session changes
        setupSessionObserver();
        
    } catch (error) {
        console.error('Singleton initialization failed:', error);
        handleFallbackInitialization();
    }
});

// Update user display function
function updateUserDisplay(currentUser) {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userInitial = document.getElementById('userInitial');
    
    if (usernameDisplay && userInitial && currentUser) {
        usernameDisplay.textContent = currentUser.username;
        userInitial.textContent = currentUser.username.charAt(0).toUpperCase();
        console.log('User display updated via Singleton');
    }
}

// ✅ CLEAN: Setup session observer dengan modular notification
function setupSessionObserver() {
    sessionManager.addObserver((action, data) => {
        console.log('Session observer triggered:', action, data);
        
        if (action === 'logout') {
            console.log('Logout observer: Processing logout...');
            // ✅ MODULAR: Gunakan NotificationSystem
            NotificationSystem.showSuccess('Logout berhasil!');
            
            // Immediate redirect with shorter timeout
            console.log('Logout observer: Redirecting to landing page...');
            setTimeout(() => {
                console.log('Observer redirect executing...');
                window.location.replace('landing_page.html');
            }, 800);
        }
    });
}

// Fallback initialization without Singleton
function handleFallbackInitialization() {
    console.log('Using fallback initialization...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Fallback user display update
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userInitial = document.getElementById('userInitial');
    
    if (usernameDisplay && userInitial) {
        usernameDisplay.textContent = currentUser.username;
        userInitial.textContent = currentUser.username.charAt(0).toUpperCase();
        console.log('User display updated via fallback');
    }
}

// Main function untuk memilih film - menggunakan Singleton
function pilihFilm(namaFilm) {
    console.log('pilihFilm called with:', namaFilm);
    
    try {
        // Gunakan Singleton instances yang sudah di-initialize
        if (!sessionManager || !movieManager || !notificationManager) {
            throw new Error('Singletons not initialized');
        }
        
        console.log('Using Singleton pattern for movie selection');
        
        // Check login status
        if (!sessionManager.isLoggedIn()) {
            console.log('User not logged in');
            NotificationSystem.showError('Session expired. Please login again.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        // Select movie using MovieManager Singleton
        if (movieManager.selectMovie(namaFilm)) {
            console.log('Movie selected successfully via Singleton:', namaFilm);
            
            // Get selected movie data
            const selectedMovie = movieManager.getSelectedMovie();
            console.log('Selected movie data:', selectedMovie);
            
            // Show success notification
            NotificationSystem.showSuccess(`Film "${namaFilm}" dipilih! Redirecting...`);
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'pilih_kursi.html';
            }, 1000);
            
        } else {
            console.log('Movie selection failed');
            NotificationSystem.showError('Film tidak tersedia atau sudah tidak tayang.');
        }
        
    } catch (error) {
        console.error('Singleton error in pilihFilm:', error);
        handleFallbackMovieSelection(namaFilm);
    }
}

// Fallback movie selection without Singleton
function handleFallbackMovieSelection(namaFilm) {
    console.log('Using fallback movie selection for:', namaFilm);
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        NotificationSystem.showError('Session expired. Please login again.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Simpan informasi film yang dipilih (fallback)
    const movieInfo = {
        title: namaFilm,
        selectedBy: currentUser.username,
        selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedMovie', JSON.stringify(movieInfo));
    console.log('Movie saved via fallback, redirecting...');
    
    // Show success notification
    NotificationSystem.showSuccess(`Film "${namaFilm}" dipilih!`);
    
    // Redirect ke halaman pilih kursi
    setTimeout(() => {
        window.location.href = 'pilih_kursi.html';
    }, 1000);
}

// Handle logout dengan custom modal
function handleLogout() {
    console.log('handleLogout called');
    showLogoutModal();
}

// Show logout modal
function showLogoutModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('logoutModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="logout-modal-overlay" id="logoutModal">
            <div class="logout-modal">
                <div class="logout-modal-header">
                    <h3>Konfirmasi Logout</h3>
                </div>
                <div class="logout-modal-body">
                    <p>Apakah Anda yakin ingin keluar dari CinemaBook?</p>
                </div>
                <div class="logout-modal-footer">
                    <button type="button" class="logout-cancel-btn" id="cancelLogoutBtn">Batal</button>
                    <button type="button" class="logout-confirm-btn" id="confirmLogoutBtn">Logout</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal with animation
    const modal = document.getElementById('logoutModal');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Add event listeners for buttons
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeLogoutModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmLogout);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLogoutModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLogoutModal();
        }
    });
}

// Close logout modal
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Remove escape key listener
    document.removeEventListener('keydown', closeLogoutModal);
}

// Custom notification function for logout
function showCustomNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element with same structure as existing notifications
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles to match existing notification system
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        font-family: inherit;
        font-size: 14px;
        min-width: 200px;
    `;
    
    // Add styles for close button
    const style = document.createElement('style');
    style.textContent = `
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .notification-close:hover {
            opacity: 1;
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto remove after 2.5 seconds (longer duration)
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 2500);
}

// ✅ CLEAN: Confirm logout dengan modular notification
function confirmLogout() {
    console.log('confirmLogout called');
    
    // Disable button to prevent double clicks
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Logging out...';
    }
    
    // Close modal immediately
    closeLogoutModal();
    
    // Show custom notification
    showCustomNotification('Logout berhasil!', 'success');
    
    // Perform logout directly without relying on observers
    console.log('Performing direct logout...');
    
    // Clear all data immediately
    if (sessionManager) {
        sessionManager.currentUser = null;
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('sessionTimestamp');
    sessionStorage.clear();
    
    // Increase delay to 2.5 seconds to let notification show properly
    console.log('Redirecting to landing page in 2.5 seconds...');
    setTimeout(() => {
        console.log('Executing redirect now...');
        window.location.href = 'landing_page.html';
    }, 2500);
}

// Expose functions to global scope for HTML onclick handlers
window.handleLogout = handleLogout;
window.pilihFilm = pilihFilm;