// Tab switching functionality
function setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        const authTitle = document.querySelector('.auth-title');
        const authSubtitle = document.querySelector('.auth-subtitle');
        const formButton = document.querySelector('.form-button');
  
        if (button.textContent === 'Daftar') {
          authTitle.textContent = 'Daftar Akun Baru';
          authSubtitle.textContent = 'Buat akun untuk mulai memesan tiket';
          formButton.textContent = 'Daftar';
        } else {
          authTitle.textContent = 'Masuk ke Akun';
          authSubtitle.textContent = 'Masukkan username dan password Anda';
          formButton.textContent = 'Masuk';
        }
      });
    });
  }
  
  // Form handling
  function setupFormHandling() {
    const form = document.querySelector('form');
    const formButton = document.querySelector('.form-button');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = form.querySelector('input[type="text"]').value.trim();
      const password = form.querySelector('input[type="password"]').value.trim();
  
      if (!username || !password) {
        alert('Semua kolom wajib diisi!');
        return;
      }
  
      if (formButton.textContent === 'Daftar') {
        registerUser(username, password);
      } else {
        loginUser(username, password);
      }
  
      form.reset();
    });
  }
  
  // Initialize UI functions on page load
  document.addEventListener('DOMContentLoaded', function() {
    setupTabSwitching();
    setupFormHandling();
  });