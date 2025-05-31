// Load users dari file JSON
async function loadUsersFromFile() {
  try {
    const response = await fetch('../data/users.json');
    if (!response.ok) {
      throw new Error('Failed to load users.json');
    }
    const userData = await response.json();
    
    // Simpan ke localStorage untuk fallback
    localStorage.setItem('usersData', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error loading users.json:', error);
    console.log('Falling back to localStorage...');
    return loadUsersFromLocalStorage();
  }
}

// Fallback ke localStorage jika file tidak bisa dibaca
function loadUsersFromLocalStorage() {
  const usersData = localStorage.getItem('usersData');
  if (!usersData) {
    // Initial default users if none exists
    const initialUsers = {
      "users": [
        {
          "username": "admin",
          "password": "admin123",
          "email": "admin@cinemabook.com",
          "registerDate": "2025-05-27"
        },
        {
          "username": "user1",
          "password": "password123",
          "email": "user1@example.com",
          "registerDate": "2025-05-27"
        }
      ]
    };
    localStorage.setItem('usersData', JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(usersData);
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

// Login functionality dengan API - dapat menggunakan username atau email
async function loginUser(usernameOrEmail, password) {
  try {
    // Coba login dengan API server
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Simpan user yang sedang login dengan data lengkap
    localStorage.setItem('currentUser', JSON.stringify({
      username: data.username,
      email: data.email,
      loginTime: new Date().toISOString()
    }));
    
    showAlert('Login berhasil! Anda akan diarahkan ke halaman utama.', 'success');
    
    // Redirect ke home page setelah 1.5 detik
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
    
  } catch (error) {
    console.error('Error:', error);
    
    // Fallback ke file JSON atau localStorage
    console.log('Falling back to file/localStorage login...');
    await loginWithFileOrLocalStorage(usernameOrEmail, password);
  }
}

// Login dengan file JSON atau localStorage sebagai fallback
async function loginWithFileOrLocalStorage(usernameOrEmail, password) {
  const usersObj = await loadUsersFromFile();
  
  // Debug: tampilkan data users
  console.log('Users data:', usersObj);
  console.log('Login attempt - Username/Email:', usernameOrEmail, 'Password:', password);
  
  // Find user berdasarkan username atau email
  const user = usersObj.users.find(user => {
    console.log('Checking user:', user.username, user.email, user.password);
    return (user.username === usernameOrEmail || user.email === usernameOrEmail) && 
           user.password === password;
  });
  
  console.log('Found user:', user);
  
  if (user) {
    // Simpan user yang sedang login dengan data lengkap
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      email: user.email,
      loginTime: new Date().toISOString()
    }));
    
    showAlert('Login berhasil! Anda akan diarahkan ke halaman utama.', 'success');
    
    // Redirect ke home page setelah 1.5 detik
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
  } else {
    showAlert('Username/Email atau password salah!', 'error');
    
    // Debug: tampilkan semua users yang tersedia
    console.log('Available users:');
    usersObj.users.forEach(u => {
      console.log(`Username: ${u.username}, Email: ${u.email}, Password: ${u.password}`);
    });
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
document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is already logged in
  checkLoggedInUser();
  
  // Initialize users data from file
  await loadUsersFromFile();
  
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const usernameOrEmail = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      // Validasi input kosong
      if (!usernameOrEmail || !password) {
        showAlert('Mohon isi semua field!', 'error');
        return;
      }
      
      // Lakukan login
      loginUser(usernameOrEmail, password);
    });
  }
});