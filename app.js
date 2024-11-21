const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datahewan',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// Routes

// READ: Tampilkan semua data hewan
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM datahewan';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error fetching data');
    }

    res.render('index', {
      animals: results,
      query: null, // Tidak ada pencarian
      title: 'Daftar Hewan',
    });
  });
});

// CREATE: Tambah data hewan baru
app.post('/add', (req, res) => {
  const { name, species, age } = req.body;
  const sql = 'INSERT INTO datahewan (name, species, age) VALUES (?, ?, ?)';

  db.query(sql, [name, species, age], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error adding data');
    }
    res.redirect('/');
  });
});

// SEARCH: Cari data hewan berdasarkan nama atau spesies
app.get('/search', (req, res) => {
  const query = req.query.query;
  const sql = 'SELECT * FROM datahewan WHERE name LIKE ? OR species LIKE ?';

  db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error searching data');
    }

    res.render('index', {
      animals: results,
      query: query, // Kirim query untuk mengontrol tombol "Lihat Semua Data Hewan"
      title: 'Hasil Pencarian',
    });
  });
});

// READ: Halaman edit data
app.get('/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM datahewan WHERE id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error fetching data');
    }

    res.render('edit', {
      animal: result[0],
      title: 'Edit Hewan',
    });
  });
});

// UPDATE: Update data hewan
app.post('/update/:id', (req, res) => {
  const { name, species, age } = req.body;
  const sql = 'UPDATE datahewan SET name = ?, species = ?, age = ? WHERE id = ?';

  db.query(sql, [name, species, age, req.params.id], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error updating data');
    }
    res.redirect('/');
  });
});

// DELETE: Hapus data hewan
app.post('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM datahewan WHERE id = ?';

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error deleting data');
    }
    res.redirect('/');
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
