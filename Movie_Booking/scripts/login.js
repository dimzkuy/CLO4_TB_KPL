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

// Login functionality dengan API
async function loginUser(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Simpan user yang sedang login
    localStorage.setItem('currentUser', username);
    
    // Redirect ke home page
    window.location.href = 'home.html';
  } catch (error) {
    alert('Username atau password salah!');
    console.error('Error:', error);
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