import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { getAllBookingsAdmin } = useBooking();
  const [adminBookings, setAdminBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isAdmin) {
      const fetchBookings = async () => {
        try {
          const data = await getAllBookingsAdmin();
          setAdminBookings(data);
        } catch (error) {
          console.error('Error fetching admin bookings', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user, getAllBookingsAdmin]);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container animate-fade-in"
      style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}
    >
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin <span className="text-gold">Dashboard</span></h1>
        <p className="text-muted">Manage platform bookings and oversight.</p>
      </div>

      <div className="card-luxury" style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '4px', height: '1.5rem', backgroundColor: 'var(--primary-gold)', display: 'inline-block', borderRadius: '4px' }}></span>
          All Bookings
        </h2>
        
        {loading ? (
          <p className="text-muted">Loading bookings...</p>
        ) : adminBookings.length === 0 ? (
          <p className="text-muted">No bookings found on the platform.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>ID</th>
                  <th style={{ padding: '1rem 0' }}>Guest</th>
                  <th style={{ padding: '1rem 0' }}>Room</th>
                  <th style={{ padding: '1rem 0' }}>Dates</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {adminBookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0' }}>#{booking.id}</td>
                    <td style={{ padding: '1rem 0' }}>{booking.guestName}</td>
                    <td style={{ padding: '1rem 0' }}>{booking.roomName}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {new Date(booking.checkIn).toLocaleDateString()} &mdash; {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '50px', 
                        fontSize: '0.85rem',
                        backgroundColor: booking.status === 'Confirmed' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                        color: booking.status === 'Confirmed' ? '#2ecc71' : '#ff4d4d'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 'bold' }} className="text-gold">
                      ₹{booking.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
