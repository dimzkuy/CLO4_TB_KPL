/**
 * Fungsi untuk melakukan logout pengguna
 * - Menghapus data currentUser dari localStorage
 * - Mengalihkan pengguna ke halaman landing page
 */
function logoutUser() {
  // Hapus data user dari localStorage
  localStorage.removeItem('currentUser');
  
  // Alihkan ke halaman login/landing page
  window.location.href = 'landing_page.html';
}

/**
 * Fungsi untuk mengatur event listener pada tombol logout
 */
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  }
}

// Inisialisasi fungsi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  setupLogoutButton();
});