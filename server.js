const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Movie_Booking')));

// API untuk register user dan update users.json
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const usersFilePath = path.join(__dirname, 'Movie_Booking', 'data', 'users.json');
  
  try {
    // Baca file users.json
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const usersObj = JSON.parse(data);
    
    // Cek apakah username sudah ada
    if (usersObj.users.some(user => user.username === username)) {
      return res.status(400).json({ success: false, message: 'Username sudah terdaftar' });
    }
    
    // Tambahkan user baru
    const newUser = {
      username,
      password,
      email: email || '',
      registerDate: new Date().toISOString().split('T')[0]
    };
    
    usersObj.users.push(newUser);
    
    // Tulis kembali ke file
    fs.writeFileSync(usersFilePath, JSON.stringify(usersObj, null, 2), 'utf8');
    
    res.json({ success: true, message: 'Pendaftaran berhasil' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API untuk login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const usersFilePath = path.join(__dirname, 'Movie_Booking', 'data', 'users.json');
  
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const usersObj = JSON.parse(data);
    
    const user = usersObj.users.find(user => 
      user.username === username && user.password === password
    );
    
    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});