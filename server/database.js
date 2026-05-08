const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase("lorm");
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rooms Table
    db.run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        price INTEGER NOT NULL,
        rating REAL,
        isGuestFavorite BOOLEAN,
        capacity INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT
      )
    `);

    // Amenities Table (many-to-many relationship simplified to JSON string for simplicity here)
    // Adding amenities column to rooms as TEXT (JSON array) instead of separate table for simplicity in this demo.
    db.run(`
      ALTER TABLE rooms ADD COLUMN amenities TEXT
    `, (err) => {
      // Ignore error if column already exists
    });

    // Bookings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        roomId INTEGER,
        checkIn DATE NOT NULL,
        checkOut DATE NOT NULL,
        totalAmount INTEGER NOT NULL,
        status TEXT DEFAULT 'Confirmed',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(roomId) REFERENCES rooms(id)
      )
    `);

    // Seed Data
    seedRooms();
  });
}

function seedRooms() {
  db.get('SELECT count(*) as count FROM rooms', (err, row) => {
    if (err) return console.error(err);
    if (row.count === 0) {
      console.log('Seeding rooms...');
      const initialRooms = [
        {
          name: 'Oceanfront Minimalist Villa',
          location: 'Malibu, California',
          price: 850,
          rating: 4.98,
          isGuestFavorite: true,
          capacity: 4,
          category: 'Beachfront',
          description: 'A stunning minimalist villa with direct ocean access and floor-to-ceiling windows.',
          amenities: JSON.stringify(['Ocean View', 'Private Pool', 'Minimalist Design', 'Smart Home']),
          imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Cozy A-Frame Cabin',
          location: 'Aspen, Colorado',
          price: 320,
          rating: 4.92,
          isGuestFavorite: false,
          capacity: 2,
          category: 'Cabins',
          description: 'Experience winter magic in this warm A-frame cabin tucked in the snowy woods.',
          amenities: JSON.stringify(['Fireplace', 'Snow View', 'Hot Tub', 'Kitchen']),
          imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Industrial Loft Studio',
          location: 'Brooklyn, New York',
          price: 210,
          rating: 4.85,
          isGuestFavorite: false,
          capacity: 2,
          category: 'City',
          description: "High ceilings and exposed brick in the heart of Brooklyn's creative district.",
          amenities: JSON.stringify(['High Speed Wi-Fi', 'City View', 'Designer Kitchen', 'Gym Access']),
          imageUrl: 'https://images.unsplash.com/photo-1536376074432-cd24f44c77ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Boutique Romance Suite',
          location: 'Paris, France',
          price: 450,
          rating: 4.99,
          isGuestFavorite: true,
          capacity: 2,
          category: 'City',
          description: 'Luxury meets romance in this elegantly appointed suite near the Eiffel Tower.',
          amenities: JSON.stringify(['Breakfast Included', 'City View', 'Spa Bath', 'Champagne on Arrival']),
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Zen Retreat Room',
          location: 'Kyoto, Japan',
          price: 280,
          rating: 4.95,
          isGuestFavorite: false,
          capacity: 1,
          category: 'City',
          description: 'Find inner peace in this traditional Japanese room with tatami mats and a zen garden view.',
          amenities: JSON.stringify(['Zen Garden', 'Tea Station', 'Meditation Space', 'Quiet Zone']),
          imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Luxury Safari Lodge',
          location: 'Serengeti, Tanzania',
          price: 1200,
          rating: 5.0,
          isGuestFavorite: true,
          capacity: 4,
          category: 'Glamping',
          description: 'An unparalleled safari experience with world-class service in the middle of the savannah.',
          amenities: JSON.stringify(['Safari Tours', 'All-Inclusive', 'Private Chef', 'Wilderness View']),
          imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Breezy Beachfront Room',
          location: 'Tulum, Mexico',
          price: 190,
          rating: 4.78,
          isGuestFavorite: false,
          capacity: 2,
          category: 'Beachfront',
          description: 'Wake up to the sound of waves in this eco-chic beachfront escape.',
          amenities: JSON.stringify(['Beach Access', 'Hammock', 'Eco-Friendly', 'Sea View']),
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Historic Castle Suite',
          location: 'Edinburgh, Scotland',
          price: 600,
          rating: 4.88,
          isGuestFavorite: false,
          capacity: 2,
          category: 'Top Picks',
          description: 'Step back in time with a stay in a real medieval castle suite with modern luxuries.',
          amenities: JSON.stringify(['Historic Decor', 'Castle Grounds', 'Fine Dining', 'Library Access']),
          imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO rooms (name, location, price, rating, isGuestFavorite, capacity, category, description, amenities, imageUrl) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      initialRooms.forEach(room => {
        stmt.run(
          room.name,
          room.location,
          room.price,
          room.rating,
          room.isGuestFavorite ? 1 : 0,
          room.capacity,
          room.category,
          room.description,
          room.amenities,
          room.imageUrl
        );
      });

      stmt.finalize();
      console.log('Seeded rooms successfully.');
    }
  });
}

module.exports = db;
