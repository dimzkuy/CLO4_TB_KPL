// Initialize user display on page load
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect ke login jika belum login
        window.location.href = 'login.html';
        return;
    }
    
    // Update tampilan user di navbar
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userInitial = document.getElementById('userInitial');
    
    if (usernameDisplay && userInitial) {
        // Tampilkan nama user
        usernameDisplay.textContent = currentUser.username;
        
        // Tampilkan inisial user (huruf pertama dari username)
        userInitial.textContent = currentUser.username.charAt(0).toUpperCase();
    }
});

// Handle logout dengan custom modal
function handleLogout() {
    console.log('handleLogout called from logout.js');
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

// Confirm logout
function confirmLogout() {
    console.log('Logout confirmed');
    
    // Hapus session
    localStorage.removeItem('currentUser');
    
    // Show success alert
    showAlert('Logout berhasil! Anda akan diarahkan ke halaman utama.', 'success');
    
    // Close modal
    closeLogoutModal();
    
    // Redirect ke landing page setelah 1.5 detik
    setTimeout(() => {
        window.location.href = 'landing_page.html';
    }, 1500);
}

// Show alert function
function showAlert(message, type) {
    // Hapus alert yang ada
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Buat alert baru
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-message">${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(alert);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Fungsi untuk menyimpan film yang dipilih dan redirect ke pilih_kursi.html
function pilihFilm(namaFilm) {
    // Cek apakah user masih login
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showAlert('Session expired. Please login again.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Simpan informasi film yang dipilih
    const movieInfo = {
        title: namaFilm,
        selectedBy: currentUser.username,
        selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedMovie', JSON.stringify(movieInfo));
    
    // Redirect ke halaman pilih kursi
    window.location.href = 'pilih_kursi.html';
}