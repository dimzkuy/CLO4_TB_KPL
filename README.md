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
├── api/                    # API Autentikasi
│ ├── pycache/
│ └── auth_api.py
│
├── data/                   #Data user
│ └── users.json
│
├── img/                    # Aset gambar
│ ├── Bank Tranfer.png
│ ├── Credit Card.png
│ ├── Inception.jpeg
│ ├── Interstelar.jpeg
│ ├── Mobile Wallet.png
│ ├── PayPal.png
│ ├── The_Dark_Knight.jpeg
│ ├── The_Shawshank_Redemption.jpeg
│ ├── The_Theory_of_Everything.jpeg
│ └── Toy_Story.jpeg
│
├── scripts/               # Script frontend
│ ├── PaymentSuccess.js
│ ├── login.js
│ ├── logout.js
│ ├── movieManager.js
│ ├── notificationManager.js
│ ├── register.js
│ ├── securityManager.js
│ ├── sessionManager.js
│ └── ui.js
│
├── sections/            # Halaman frontend
│ ├── film_landing.html
│ ├── home.html
│ ├── jadwal.html
│ ├── jadwal_landing.html
│ ├── landing_page.html
│ ├── login.html
│ ├── payment.html
│ ├── paymentsuccess.html
│ ├── pilih_kursi.html
│ └── register.html
│
├── servers/
│ └── package.json
│
├── styles/             # CSS styling
│ ├── seat.css
│ └── style.css
│
├── .gitignore
├── app.py             # Entry point Flask backend
├── migrate_to_flask.py
├── requirements.txt   # Library Python yang dibutuhkan
└── README.md
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
