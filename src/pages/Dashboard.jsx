import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { User as UserIcon, Calendar, Hotel, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { bookings, getRoomById, cancelBooking, loading } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      alert(error.message || 'Failed to cancel booking');
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in container" style={{ padding: '4rem 1.5rem' }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar / Profile */}
        <div className="md:col-span-1">
          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>
              <UserIcon size={48} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{user.name}</h3>
            <p className="text-muted mb-6" style={{ fontSize: '0.9rem' }}>{user.email}</p>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Bookings</p>
              <p className="font-serif text-gold" style={{ fontSize: '2rem' }}>{bookings.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content / Booking History */}
        <div className="md:col-span-3">
          <div className="card-luxury" style={{ padding: '2rem' }}>
            <h2 className="font-serif mb-6 flex items-center gap-2">
              <Calendar className="text-gold" /> My Reservations
            </h2>

            {bookings.length === 0 ? (
              <div className="text-center py-12" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <Hotel size={48} className="text-muted mx-auto mb-4" />
                <p className="text-muted mb-4">You have no booking history yet.</p>
                <Link to="/rooms" className="btn btn-outline">Explore Rooms</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => {
                  const room = getRoomById(booking.roomId);
                  if (!room) return null;
                  
                  return (
                    <div key={booking.id} style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '1.5rem', 
                      padding: '1.5rem', 
                      backgroundColor: booking.status === 'Cancelled' ? 'rgba(255, 77, 77, 0.05)' : 'var(--bg-color)', 
                      opacity: booking.status === 'Cancelled' ? 0.6 : 1,
                      borderRadius: 'var(--border-radius-md)', 
                      border: `1px solid ${booking.status === 'Cancelled' ? 'rgba(255, 77, 77, 0.3)' : 'var(--border-color)'}`
                    }}>
                      <div style={{ width: '120px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={room.imageUrl} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{room.name}</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          {new Date(booking.checkIn).toLocaleDateString()} &mdash; {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <p className="text-gold font-bold">₹{booking.totalAmount}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: '120px' }}>
                        <div className="flex items-center gap-1" style={{ color: booking.status === 'Confirmed' ? '#2ed573' : 'var(--error)', fontSize: '0.85rem', fontWeight: 500 }}>
                          {booking.status === 'Confirmed' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {booking.status}
                        </div>
                        
                        {booking.status === 'Confirmed' && (
                          <button 
                            className="btn btn-ghost error-text" 
                            style={{ padding: '0.25rem 0.5rem', marginTop: '0.5rem' }}
                            onClick={() => handleCancel(booking.id)}
                            disabled={loading}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .md\\:col-span-1 { grid-column: span 1 / span 1; }
        .md\\:col-span-3 { grid-column: span 3 / span 3; }
        @media (min-width: 768px) {
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
