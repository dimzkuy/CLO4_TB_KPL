// Load users dari localStorage (untuk UI)
function loadUsers() {
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
    
    // Simpan user yang sedang login
    localStorage.setItem('currentUser', data.username);
    
    // Redirect ke home page
    window.location.href = 'home.html';
  } catch (error) {
    console.error('Error:', error);
    
    // Fallback ke localStorage jika server tidak tersedia
    console.log('Falling back to localStorage login...');
    loginWithLocalStorage(usernameOrEmail, password);
  }
}

// Login dengan localStorage sebagai fallback - mendukung email atau username
function loginWithLocalStorage(usernameOrEmail, password) {
  const usersObj = loadUsers();
  
  // Find user berdasarkan username atau email
  const user = usersObj.users.find(user => 
    (user.username === usernameOrEmail || user.email === usernameOrEmail) && 
    user.password === password
  );
  
  if (user) {
    // Simpan user yang sedang login
    localStorage.setItem('currentUser', user.username);
    
    // Redirect ke home page
    window.location.href = 'home.html';
  } else {
    alert('Username/Email atau password salah!');
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
  
  // Initialize users data
  loadUsers();
});