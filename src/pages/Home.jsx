import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import RoomCard from '../components/RoomCard';
import SkeletonCard from '../components/SkeletonCard';

const Home = () => {
  const { filteredRooms } = useBooking();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const featuredRooms = filteredRooms.slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      {/* Enhanced Eye-Opening Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '100vh', 
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '-80px',
        paddingTop: '80px',
        color: 'white',
        overflow: 'hidden'
      }}>
        
        {/* Animated Background Image (Ken Burns Effect) */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />

        {/* Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
          zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-split-layout">
            
            {/* Left Content */}
            <div className="hero-text-content">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ height: '3px', backgroundColor: 'var(--primary-gold)', marginBottom: '2rem' }}
              />
              <motion.h1 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                style={{ 
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
                  color: 'white', 
                  marginBottom: '1.5rem', 
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                  lineHeight: 1.05,
                  fontWeight: 400
                }}
              >
                Discover <br/>
                <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)', fontWeight: 600 }}>Extraordinary</span><br/>
                Comfort.
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                style={{ 
                  fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', 
                  color: '#f0f0f0', 
                  maxWidth: '550px', 
                  marginBottom: '3rem',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  lineHeight: 1.6
                }}
              >
                Step into a realm of unparalleled luxury. From breathtaking oceanfront villas to exclusive city penthouses, your perfect sanctuary awaits.
              </motion.p>
            </div>

            {/* Right Content (Buttons) */}
            <div className="hero-action-content">
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem', 
                  width: '100%', 
                  maxWidth: '320px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  padding: '2.5rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
              >
                <Link to="/rooms" className="btn btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 600, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)' }}>
                  Explore Rooms
                </Link>
                <Link to="/register" className="btn btn-outline" style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '50px', color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '1px' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                >
                  Create Account
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="grid-features">
          <div className="card-feature text-center">
            <div className="icon-wrapper">
              <Star size={32} />
            </div>
            <h3>5-Star Experience</h3>
            <p className="text-muted">Enjoy world-class amenities and personalized service tailored to your every need.</p>
          </div>
          <div className="card-feature text-center">
            <div className="icon-wrapper">
              <Clock size={32} />
            </div>
            <h3>24/7 Concierge</h3>
            <p className="text-muted">Our dedicated team is available around the clock to ensure your stay is flawless.</p>
          </div>
          <div className="card-feature text-center">
            <div className="icon-wrapper">
              <Shield size={32} />
            </div>
            <h3>Secure Booking</h3>
            <p className="text-muted">Book with confidence using our secure, encrypted reservation system.</p>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section style={{ backgroundColor: 'var(--surface-color)', padding: '5rem 0' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 style={{ fontSize: '2.5rem' }}>Featured <span className="text-gold">Rooms</span></h2>
            <Link to="/rooms" className="btn btn-outline">View All</Link>
          </div>
          
          <div className="room-grid">
            {isInitialLoading ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <AnimatePresence mode='popLayout'>
                {featuredRooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .grid-features {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .grid-features { grid-template-columns: repeat(3, 1fr); }
        }
        .card-feature {
          padding: 2rem;
          background-color: var(--surface-color);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
        }
        .icon-wrapper {
          display: inline-flex;
          padding: 1rem;
          border-radius: 50%;
          background-color: rgba(212, 175, 55, 0.1);
          color: var(--primary-gold);
          margin-bottom: 1.5rem;
        }
        .hero-split-layout {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          align-items: flex-start;
        }
        .hero-action-content {
          width: 100%;
          display: flex;
          justify-content: flex-start;
        }
        @media (min-width: 992px) {
          .hero-split-layout {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .hero-text-content {
            flex: 1.5;
            padding-right: 2rem;
          }
          .hero-action-content {
            flex: 1;
            justify-content: flex-end;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;
