const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
    
    const isAdmin = email === 'admin@luxestay.com' ? 1 : 0;
    
    db.run(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, isAdmin],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Failed to register user' });
        }
        
        const token = jwt.sign({ id: this.lastID, name, email, isAdmin: isAdmin === 1 }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ 
          token, 
          user: { id: this.lastID, name, email, isAdmin: isAdmin === 1 } 
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

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin === 1 }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin === 1 } 
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

// Verify Admin Middleware
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    next();
  });
};

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) {
      // Still return success for security (prevents email enumeration)
      return res.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    db.run(
      'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
          return res.status(500).json({ error: 'Server configuration error: SMTP credentials are not set up properly in the .env file.' });
        }
        
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          await transporter.sendMail({
            from: `"MM Guest Rooms" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
              <h2>Password Reset</h2>
              <p>You requested a password reset for your MM Guest Rooms account.</p>
              <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
            `
          });
          
          res.json({ success: true, message: 'Reset link sent to email' });
        } catch (emailErr) {
          console.error('Error sending email:', emailErr);
          res.status(500).json({ error: 'Failed to send reset email. Make sure SMTP credentials are set.' });
        }
      }
    );
  });
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });

  db.get('SELECT * FROM users WHERE resetToken = ?', [token], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

    // Check expiry
    const expiryDate = new Date(user.resetTokenExpiry);
    if (expiryDate < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.run(
        'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.json({ success: true, message: 'Password has been reset successfully' });
        }
      );
    } catch (hashErr) {
      res.status(500).json({ error: 'Error processing new password' });
    }
  });
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

// --- Admin APIs ---

// Get all bookings
app.get('/api/admin/bookings', authenticateAdmin, (req, res) => {
  const query = `
    SELECT b.*, u.name as guestName, r.name as roomName 
    FROM bookings b 
    JOIN users u ON b.userId = u.id 
    JOIN rooms r ON b.roomId = r.id
    ORDER BY b.createdAt DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch all bookings' });
    res.json(rows);
  });
});

// Update booking status
app.put('/api/admin/bookings/:id/status', authenticateAdmin, (req, res) => {
  const { status } = req.body;
  if (!['Confirmed', 'Cancelled', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    "UPDATE bookings SET status = ? WHERE id = ?",
    [status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update booking status' });
      if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });
      res.json({ success: true, message: 'Booking status updated' });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
