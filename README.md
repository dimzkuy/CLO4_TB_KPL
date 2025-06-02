# 🎬 Movie Booking App

Aplikasi pemesanan tiket bioskop berbasis web, dilengkapi dengan sistem login menggunakan *Finite State Automata*, backend Python Flask, dan antarmuka interaktif berbasis HTML/CSS/JavaScript.

## 👥 Anggota Kelompok

| No | Nama                     | NIM         |
|----|--------------------------|-------------|
| 1  | Dwi Candra Pratama       | 2211104035  |
| 2  | Aditya Prabu Mukti       | 2211104037  |
| 3  | Arwin Nabiel Arrofif     | 2211104057  |
| 4  | Dimas Cahyo Margono      | 2211104060  |

## 🗂️ Struktur Proyek

```
Movie_Booking/
│
├── api/                     # Backend API (Flask)
│   └── auth_api.py          # API untuk login
│
├── data/                    # Data user
│   └── users.json
│
├── img/                     # Gambar film dan pembayaran
│   ├── Inception.jpeg
│   ├── Credit Card.png
│   └── ...
│
├── scripts/                 # Semua file JavaScript frontend
│   ├── login.js             # Sistem login dengan FSA
│   ├── register.js
│   └── ...
│
├── sections/                # Halaman HTML
│   ├── login.html
│   ├── register.html
│   ├── home.html
│   └── ...
│
├── styles/                  # CSS styling
│   ├── style.css
│   └── seat.css
│
├── app.py                   # Entry point Flask backend
├── requirements.txt         # Library yang dibutuhkan
└── README.md                # Dokumentasi ini
```

## ▶️ Cara Menjalankan Proyek

### 💻 1. Jalankan Backend (Flask)
Pastikan kamu sudah install `Python 3` dan `pip`.

```bash
cd Movie_Booking
pip install -r requirements.txt
python app.py
```

Flask akan berjalan di `http://localhost:5000`.

### 🌐 2. Jalankan Frontend
Buka file `sections/landing_page.html` langsung di browser

> Pastikan `login.js` sudah melakukan request ke `http://localhost:5000/api/login`.



## 📌 Catatan Tambahan

- Gunakan `register.js` jika ingin menambah user via UI.
- Gunakan `Flask-CORS` jika frontend dan backend dipisah domain.
- Sistem login menggunakan finite state automata dan popup interaktif.

---

> *Dikembangkan untuk keperluan pembelajaran dan tugas besar KPL.*
