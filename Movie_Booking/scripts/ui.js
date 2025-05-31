/**
 * UI.js - Class untuk mengelola elemen UI dan interaksi pengguna
 * 
 * File ini menangani semua interaksi UI seperti tab switching dan form handling
 * secara terpisah dari HTML, sehingga kode menjadi lebih clean dan modular
 */

class CinemaBookUI {
  constructor() {
    // Simpan referensi ke elemen DOM yang sering digunakan
    this.loginForm = document.getElementById('login-form');
    this.registerForm = document.getElementById('register-form');
    this.tabButtons = document.querySelectorAll('.tab-btn');
    
    // Elements for login form
    this.loginFormElement = document.getElementById('loginForm');
    this.loginUsernameInput = document.getElementById('loginUsername');
    this.loginPasswordInput = document.getElementById('loginPassword');
    
    // Elements for register form
    this.registerFormElement = document.getElementById('registerForm');
    this.registerUsernameInput = document.getElementById('registerUsername');
    this.registerEmailInput = document.getElementById('registerEmail');
    this.registerPasswordInput = document.getElementById('registerPassword');
  }

  /**
   * Inisialisasi event listeners dan setup UI
   */
  init() {
    this.setupTabSwitching();
    this.setupFormHandling();
  }

  /**
   * Setup tab switching antara login dan register
   */
  setupTabSwitching() {
    // Gunakan arrow function agar 'this' tetap merujuk ke class CinemaBookUI
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Reset active state untuk semua tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set active state untuk tab yang diklik
        button.classList.add('active');
        
        // Switch form berdasarkan tab yang dipilih
        if (button.textContent === 'Daftar') {
          this.switchToRegisterForm();
        } else {
          this.switchToLoginForm();
        }
      });
    });
  }
  
  /**
   * Menampilkan form login dan menyembunyikan form register
   */
  switchToLoginForm() {
    if (this.loginForm) this.loginForm.style.display = 'block';
    if (this.registerForm) this.registerForm.style.display = 'none';
    
    // Update title dan subtitle
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');
    
    if (authTitle) authTitle.textContent = 'Masuk ke Akun';
    if (authSubtitle) authSubtitle.textContent = 'Masukkan username/email dan password Anda';
  }
  
  /**
   * Menampilkan form register dan menyembunyikan form login
   */
  switchToRegisterForm() {
    if (this.loginForm) this.loginForm.style.display = 'none';
    if (this.registerForm) this.registerForm.style.display = 'block';
    
    // Update title dan subtitle
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');
    
    if (authTitle) authTitle.textContent = 'Daftar Akun Baru';
    if (authSubtitle) authSubtitle.textContent = 'Buat akun untuk mulai memesan tiket';
  }

  /**
   * Setup form handling untuk login dan register
   */
  setupFormHandling() {
    // Setup login form submission
    if (this.loginFormElement) {
      this.loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameOrEmail = this.loginUsernameInput.value.trim();
        const password = this.loginPasswordInput.value.trim();
        
        if (!usernameOrEmail || !password) {
          alert('Semua kolom wajib diisi!');
          return;
        }
        
        // Call login function (dari login.js)
        if (typeof loginUser === 'function') {
          loginUser(usernameOrEmail, password);
        } else {
          console.error('loginUser function is not defined');
        }
      });
    }
    
    // Setup register form submission
    if (this.registerFormElement) {
      this.registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = this.registerUsernameInput.value.trim();
        const email = this.registerEmailInput.value.trim();
        const password = this.registerPasswordInput.value.trim();
        
        if (!username || !password) {
          alert('Username dan password wajib diisi!');
          return;
        }
        
        // Call register function (dari register.js)
        if (typeof registerUser === 'function') {
          registerUser(username, password, email);
          
          // Reset form setelah registrasi berhasil
          this.registerFormElement.reset();
          
          // Switch kembali ke tab login
          this.tabButtons[0].click();
        } else {
          console.error('registerUser function is not defined');
        }
      });
    }
  }
  
  /**
   * Reset semua form
   */
  resetForms() {
    if (this.loginFormElement) this.loginFormElement.reset();
    if (this.registerFormElement) this.registerFormElement.reset();
  }
}

// Create and initialize UI when document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Cek apakah kita berada di halaman login/register
  if (document.querySelector('.auth-container')) {
    const cinemaBookUI = new CinemaBookUI();
    cinemaBookUI.init();
    
    // Expose UI instance globally untuk debugging dan akses dari script lain jika diperlukan
    window.cinemaBookUI = cinemaBookUI;
  }
});

