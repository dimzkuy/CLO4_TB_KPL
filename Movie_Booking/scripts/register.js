// Load users dari localStorage
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

// Save users ke localStorage
function saveUsers(usersObj) {
  localStorage.setItem('usersData', JSON.stringify(usersObj));
}

// Register functionality dengan API ke server
async function registerUser(username, password, email = "") {
  try {
    // Kirim data ke server untuk update users.json
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Update juga di localStorage untuk UI
    const usersObj = loadUsers();
    const newUser = {
      username,
      password,
      email,
      registerDate: new Date().toISOString().split('T')[0]
    };
    usersObj.users.push(newUser);
    saveUsers(usersObj);
    
    alert('Pendaftaran berhasil! Silakan login.');
    return true;
  } catch (error) {
    alert('Error: ' + error.message);
    console.error('Error:', error);
    return false;
  }
}

// Tambahkan listener untuk form register jika diperlukan
document.addEventListener('DOMContentLoaded', function() {
  // Kode inisialisasi lainnya jika diperlukan
});