import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, CheckCircle } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomById, createBooking, getRecentGuestsForRoom, loading } = useBooking();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [recentGuests, setRecentGuests] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchedRoom = getRoomById(id);
    if (fetchedRoom) {
      setRoom(fetchedRoom);
      getRecentGuestsForRoom(id).then(guests => setRecentGuests(guests));
    } else {
      navigate('/rooms');
    }
    window.scrollTo(0, 0);
  }, [id, getRoomById, getRecentGuestsForRoom, navigate]);

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !room) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return nights * room.price;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!user) {
      navigate('/login', { state: { returnTo: `/room/${id}` } });
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    try {
      await createBooking(room.id, checkIn, checkOut, calculateTotal());
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create booking.');
    }
  };

  if (!room) return <div className="container text-center mt-8">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container" 
      style={{ padding: '4rem 1.5rem' }}
    >
      <div className="grid-details">
        
        {/* Room Details Side */}
        <div className="details-content">
          <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', marginBottom: '2rem', aspectRatio: '16/9', border: '1px solid var(--border-color)' }}>
            <img src={room.imageUrl} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div className="flex justify-between items-end mb-4">
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{room.name}</h1>
            <div className="text-right">
              <span className="text-gold" style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>₹{room.price}</span>
              <span className="text-muted">/night</span>
            </div>
          </div>
          
          <p className="text-muted mb-8" style={{ fontSize: '1.1rem' }}>{room.description}</p>
          
          <div className="card-luxury" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 className="mb-4">Amenities</h3>
            <div className="grid-amenities">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-muted">
                  <CheckCircle size={18} className="text-gold" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Guests Section */}
          {recentGuests.length > 0 && (
            <div className="card-luxury" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 className="mb-4">Recent Guests</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentGuests.map((guest, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: idx !== recentGuests.length - 1 ? '1rem' : '0', borderBottom: idx !== recentGuests.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                      {guest.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{guest.name}</p>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Stayed recently</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Booking Form Side */}
        <div className="booking-sidebar">
          <div className="card-luxury sticky-form" style={{ padding: '2rem' }}>
            <h3 className="mb-6" style={{ textAlign: 'center' }}>Reserve Your Stay</h3>
            
            {success ? (
              <div className="text-center py-8">
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(46, 213, 115, 0.1)', color: '#2ed573', marginBottom: '1.5rem' }}>
                  <CheckCircle size={48} />
                </div>
                <h4>Booking Confirmed!</h4>
                <p className="text-muted mt-2">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="form-group mb-4">
                  <label className="form-label-clean">Check-in Date</label>
                  <input 
                    type="date" 
                    className="form-control-date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                
                <div className="form-group mb-4">
                  <label className="form-label-clean">Check-out Date</label>
                  <input 
                    type="date" 
                    className="form-control-date" 
                    required
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                
                <div className="form-group mb-6">
                  <label className="form-label flex items-center gap-2"><Users size={16}/> Guests</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1" 
                    max={room.capacity}
                    defaultValue="1"
                    required
                  />
                </div>

                {checkIn && checkOut && (
                  <div className="booking-summary mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted">Total Amount</span>
                      <span className="text-gold font-bold" style={{ fontSize: '1.25rem' }}>₹{calculateTotal()}</span>
                    </div>
                  </div>
                )}

                {error && <p className="error-text mb-4" style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
                
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (user ? 'Confirm Booking' : 'Login to Book')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .grid-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 1024px) {
          .grid-details { grid-template-columns: 1.8fr 1.2fr; }
        }
        .card-luxury {
          background-color: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
        }
        .grid-amenities {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .form-control {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          color: var(--text-main);
          font-family: var(--font-sans);
        }
        .form-label-clean {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .form-control-date {
          width: 100%;
          padding: 0.85rem 1rem;
          background-color: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 1rem;
          transition: border-color var(--transition-fast);
        }
        .form-control-date:focus {
          outline: none;
          border-color: var(--primary-gold);
        }
        .form-control-date::-webkit-calendar-picker-indicator {
          filter: invert(0.8);
          opacity: 0.6;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .form-control-date::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        [data-theme='light'] .form-control-date::-webkit-calendar-picker-indicator {
          filter: none;
        }
        .sticky-form {
          position: sticky;
          top: 100px;
        }
        .booking-summary {
          padding: 1rem;
          background-color: rgba(0,0,0,0.05);
          border-radius: var(--border-radius-sm);
        }
      `}</style>
    </motion.div>
  );
};

export default RoomDetails;
