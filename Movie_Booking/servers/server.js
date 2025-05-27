const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Penyesuaian path statis - naik satu level dari folder servers
app.use(express.static(path.join(__dirname, '..')));

// Tangani root route untuk redirect ke landing_page
app.get('/', (req, res) => {
  res.redirect('/sections/landing_page.html');
});

// API untuk register user dan update users.json
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  // Penyesuaian path ke users.json - sekarang relatif terhadap folder servers
  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
  
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
  const { usernameOrEmail, password } = req.body;
  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
  
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const usersObj = JSON.parse(data);
    
    // Find user berdasarkan username atau email
    const user = usersObj.users.find(user => 
      (user.username === usernameOrEmail || user.email === usernameOrEmail) && 
      user.password === password
    );
    
    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res.status(401).json({ success: false, message: 'Username/Email atau password salah' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Log request paths untuk memudahkan debugging
app.use((req, res, next) => {
  console.log(`Request path: ${req.path}`);
  next();
});

// Menangani permintaan ke file HTML secara eksplisit
app.get('/sections/landing_page.html', (req, res) => {
  const filePath = path.join(__dirname, '..', 'sections', 'landing_page.html');
  console.log('Mencari file di:', filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error('File tidak ditemukan:', filePath);
    res.status(404).send('File landing_page.html tidak ditemukan');
  }
});

app.get('/sections/home.html', (req, res) => {
  const filePath = path.join(__dirname, '..', 'sections', 'home.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File home.html tidak ditemukan');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`Cannot GET ${req.path}`);
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Access the app at: http://localhost:${PORT}/sections/landing_page.html`);
  console.log(`Root path redirects to: http://localhost:${PORT}/`);
});