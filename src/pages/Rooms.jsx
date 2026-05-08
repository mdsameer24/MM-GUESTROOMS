import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';

const Rooms = () => {
  const { filteredRooms } = useBooking();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container" 
      style={{ padding: '4rem 1.5rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our <span className="text-gold">Accommodations</span></h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Discover our range of meticulously designed rooms and suites, each offering a unique blend of comfort, style, and luxury.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredRooms.map((room) => (
          <div key={room.id} className="card-luxury flex-row-desktop">
            <div className="room-img-wrapper">
              <img src={room.imageUrl} alt={room.name} />
            </div>
            
            <div className="room-content-wrapper">
              <div className="flex justify-between items-start mb-4">
                <h2 style={{ margin: 0 }}>{room.name}</h2>
                <div className="text-right">
                  <span className="text-gold" style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>${room.price}</span>
                  <span className="text-muted" style={{ display: 'block', fontSize: '0.85rem' }}>per night</span>
                </div>
              </div>
              
              <p className="text-muted mb-6">{room.description}</p>
              
              <div className="amenities-row">
                <div className="flex items-center gap-2 text-muted">
                  <Users size={20} className="text-gold" />
                  <span>{room.capacity} Guests</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Wifi size={20} className="text-gold" />
                  <span>Free Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Coffee size={20} className="text-gold" />
                  <span>Room Service</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-auto">
                <Link to={`/room/${room.id}`} className="btn btn-outline" style={{ flex: 1 }}>View Details</Link>
                <Link to={`/room/${room.id}`} className="btn btn-primary" style={{ flex: 1 }}>Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .card-luxury {
          background-color: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .room-img-wrapper {
          flex: 0 0 40%;
          min-height: 250px;
        }
        .room-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .room-content-wrapper {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .amenities-row {
          display: flex;
          gap: 2rem;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) {
          .flex-row-desktop { flex-direction: row; }
        }
      `}</style>
    </motion.div>
  );
};

export default Rooms;
