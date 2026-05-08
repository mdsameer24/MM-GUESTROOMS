const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'luxestay_super_secret_key_123'; // In production, use env variable

app.use(cors());
app.use(express.json());

// --- Authentication APIs ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Failed to register user' });
        }
        
        const token = jwt.sign({ id: this.lastID, name, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ 
          token, 
          user: { id: this.lastID, name, email } 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  });
});

// Verify Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- Rooms APIs ---

app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch rooms' });
    
    // Parse amenities JSON back to array
    const rooms = rows.map(row => ({
      ...row,
      isGuestFavorite: row.isGuestFavorite === 1,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    }));
    
    res.json(rooms);
  });
});

app.get('/api/rooms/:id', (req, res) => {
  db.get('SELECT * FROM rooms WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch room' });
    if (!row) return res.status(404).json({ error: 'Room not found' });
    
    const room = {
      ...row,
      isGuestFavorite: row.isGuestFavorite === 1,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    };
    
    res.json(room);
  });
});

// Get recent guests for a room
app.get('/api/rooms/:id/recent-guests', (req, res) => {
  const query = `
    SELECT u.name, b.createdAt as bookedAt 
    FROM bookings b 
    JOIN users u ON b.userId = u.id 
    WHERE b.roomId = ? AND b.status = 'Confirmed'
    ORDER BY b.createdAt DESC
    LIMIT 5
  `;
  
  db.all(query, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch recent guests' });
    
    // Anonymize names (e.g. "John Doe" -> "John D.")
    const anonymizedGuests = rows.map(row => {
      const parts = row.name.split(' ');
      const firstName = parts[0];
      const lastInitial = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : '';
      return {
        name: `${firstName} ${lastInitial}`.trim(),
        bookedAt: row.bookedAt
      };
    });
    
    res.json(anonymizedGuests);
  });
});

// --- Bookings APIs ---

// Get user bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bookings WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch bookings' });
    res.json(rows);
  });
});

// Create booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { roomId, checkIn, checkOut, totalAmount } = req.body;
  
  if (!roomId || !checkIn || !checkOut || !totalAmount) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  db.run(
    'INSERT INTO bookings (userId, roomId, checkIn, checkOut, totalAmount) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, roomId, checkIn, checkOut, totalAmount],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to create booking' });
      
      db.get('SELECT * FROM bookings WHERE id = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: 'Created, but failed to fetch' });
        res.status(201).json(row);
      });
    }
  );
});

// Cancel booking
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  
  // Actually we just update status to 'Cancelled' instead of hard delete, based on previous logic
  db.run(
    "UPDATE bookings SET status = 'Cancelled' WHERE id = ? AND userId = ?",
    [bookingId, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to cancel booking' });
      if (this.changes === 0) return res.status(404).json({ error: 'Booking not found or unauthorized' });
      res.json({ success: true, message: 'Booking cancelled' });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
