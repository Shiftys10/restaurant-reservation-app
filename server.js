const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(express.json());

// Middleware για JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Σύνδεση DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_reservation_system',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database.');
});

// REGISTER
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.status(201).json({ message: 'Registration successful', user_id: result.insertId });
    });
  });
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, 'secretkey', {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

// GET RESTAURANTS
app.get('/restaurants', (req, res) => {
  const { location, name } = req.query;
  let sql = 'SELECT * FROM restaurants';
  const params = [];

  if (location || name) {
    sql += ' WHERE';
    const conditions = [];
    if (location) {
      conditions.push(' location LIKE ? ');
      params.push(`%${location}%`);
    }
    if (name) {
      conditions.push(' name LIKE ? ');
      params.push(`%${name}%`);
    }
    sql += conditions.join(' AND ');
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// POST RESERVATION ✅ ΔΙΟΡΘΩΜΕΝΟ
app.post('/reservations', authenticateToken, (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;

  if (
    restaurant_id === undefined ||
    !date ||
    !time ||
    people_count === undefined
  ) {
    return res.status(400).json({ message: 'Missing reservation details' });
  }

  const user_email = req.user.email;

  db.query('SELECT user_id FROM users WHERE email = ?', [user_email], (err, userResults) => {
    if (err) return res.status(500).json({ message: 'User lookup error' });

    const user_id = userResults[0].user_id;

    db.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, date, time, people_count],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Reservation successful' });
      }
    );
  });
});

// GET USER RESERVATIONS
app.get('/user/reservations', authenticateToken, (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user_id' });
  }

  const sql = `
    SELECT r.*, rest.name AS restaurant_name
    FROM reservations r
    JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
    WHERE r.user_id = ?
    ORDER BY r.date DESC, r.time DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// DELETE RESERVATION
app.delete('/reservations/:id', authenticateToken, (req, res) => {
  const reservationId = req.params.id;
  const sql = 'DELETE FROM reservations WHERE reservation_id = ?';

  db.query(sql, [reservationId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  });
});

// UPDATE RESERVATION ✅ ΔΙΟΡΘΩΜΕΝΟ
app.put('/reservations/:id', authenticateToken, (req, res) => {
  const reservationId = req.params.id;
  const { date, time, people_count } = req.body;

  if (!date || !time || people_count === undefined) {
    return res.status(400).json({ message: 'Missing reservation details' });
  }

  const sql = `
    UPDATE reservations
    SET date = ?, time = ?, people_count = ?
    WHERE reservation_id = ?
  `;

  const values = [date, time, people_count, reservationId];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated successfully' });
  });
});

// HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

// START
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
