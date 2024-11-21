const mysql = require('mysql2');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datahewan' // Ganti dengan nama database Anda
});

// Hubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Gagal terhubung ke database:', err.message);
    process.exit(1); // Hentikan aplikasi jika gagal koneksi
  }
  console.log('Terhubung ke database MySQL!');
});

module.exports = db;
