// Load users dari file JSON melalui server
async function loadUsersFromFile() {
  try {
    const response = await fetch('/data/users.json');
    if (!response.ok) {
      throw new Error('Failed to load users.json');
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error loading users.json:', error);
    throw error;
  }
}

// Show alert popup
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

// Register functionality dengan API ke server - HANYA simpan ke users.json
async function registerUser(username, email, password) {
  try {
    console.log('Attempting registration with server...', { username, email, password });
    
    // Kirim data ke server untuk update users.json
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      showAlert('Registrasi berhasil!', 'success');
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      
      return true;
    } else {
      showAlert(data.message || 'Registrasi gagal!', 'error');
      return false;
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    showAlert(`Registrasi gagal: ${error.message}. Pastikan server berjalan!`, 'error');
    return false;
  }
}

// Check if user is already logged in
function checkLoggedInUser() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    window.location.href = 'home.html';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  checkLoggedInUser();
  
  // Handle register form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('registerUsername').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validasi input kosong
      if (!username || !email || !password || !confirmPassword) {
        showAlert('Mohon isi semua field!', 'error');
        return;
      }
      
      // Validasi email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Format email tidak valid!', 'error');
        return;
      }
      
      // Validasi password
      if (password !== confirmPassword) {
        showAlert('Password dan konfirmasi password tidak cocok!', 'error');
        return;
      }
      
      // Validasi panjang password
      if (password.length < 6) {
        showAlert('Password harus minimal 6 karakter!', 'error');
        return;
      }
      
      // Validasi username (minimal 3 karakter, hanya alphanumeric)
      if (username.length < 3) {
        showAlert('Username harus minimal 3 karakter!', 'error');
        return;
      }
      
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        showAlert('Username hanya boleh mengandung huruf, angka, dan underscore!', 'error');
        return;
      }
      
      // Lakukan registrasi - HANYA ke server/users.json
      await registerUser(username, email, password);
    });
  }
});