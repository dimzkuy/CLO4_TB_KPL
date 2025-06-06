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
            // ✅ MODULAR: Gunakan NotificationSystem
            NotificationSystem.showSuccess('Logout berhasil!');
            setTimeout(() => {
                window.location.href = 'landing_page.html';
            }, 1500);
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
                    <button class="logout-cancel-btn" onclick="closeLogoutModal()">Batal</button>
                    <button class="logout-confirm-btn" onclick="confirmLogout()">Logout</button>
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
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
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
}

// ✅ CLEAN: Confirm logout dengan modular notification
function confirmLogout() {
    console.log('confirmLogout called');
    
    try {
        if (sessionManager) {
            console.log('Using Singleton for logout');
            sessionManager.logout(); // Will trigger observer dengan modular notification
        } else {
            throw new Error('SessionManager not available');
        }
    } catch (error) {
        console.log('Using fallback logout');
        // Fallback logout
        localStorage.removeItem('currentUser');
        
        // ✅ MODULAR: Gunakan NotificationSystem untuk fallback
        NotificationSystem.showSuccess('Logout berhasil!');
        
        setTimeout(() => {
            window.location.href = 'landing_page.html';
        }, 1500);
    }
    
    closeLogoutModal();
}

// Testing functions - hapus di production
function testSingletons() {
    console.log('=== Testing Singletons ===');
    
    const session1 = SessionManager.getInstance();
    const session2 = SessionManager.getInstance();
    console.log('SessionManager - Same instance?', session1 === session2);
    
    const movie1 = MovieManager.getInstance();
    const movie2 = MovieManager.getInstance();
    console.log('MovieManager - Same instance?', movie1 === movie2);
    
    const notif1 = NotificationManager.getInstance();
    const notif2 = NotificationManager.getInstance();
    console.log('NotificationManager - Same instance?', notif1 === notif2);
    
    console.log('Current user:', session1.getCurrentUser());
    console.log('Available movies:', movie1.getAvailableMovies());
}

// Expose untuk testing di console
window.testSingletons = testSingletons;
window.sessionManager = () => sessionManager;
window.movieManager = () => movieManager;
window.notificationManager = () => notificationManager;