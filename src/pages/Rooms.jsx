import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';

const Rooms = () => {
  const { 
    filteredRooms, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory, 
    priceSort, 
    setPriceSort 
  } = useBooking();

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

      {/* Search and Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={20} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '50px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1 1 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border-color)' }}>
            <Filter size={18} className="text-gold" />
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Top Picks">Top Picks</option>
              <option value="Beachfront">Beachfront</option>
              <option value="Cabins">Cabins</option>
              <option value="City">City</option>
              <option value="Glamping">Glamping</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border-color)' }}>
            <ArrowUpDown size={18} className="text-gold" />
            <select 
              value={priceSort} 
              onChange={(e) => setPriceSort(e.target.value)}
              className="filter-select"
            >
              <option value="none">Sort by Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredRooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No rooms found</h3>
            <p className="text-muted">Try adjusting your search or filters to find what you're looking for.</p>
            <button onClick={() => {setSearchQuery(''); setActiveCategory('All'); setPriceSort('none');}} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Clear Filters</button>
          </div>
        ) : (
          filteredRooms.map((room) => (
          <div key={room.id} className="card-luxury flex-row-desktop">
            <div className="room-img-wrapper">
              <img src={room.imageUrl} alt={room.name} />
            </div>
            
            <div className="room-content-wrapper">
              <div className="flex justify-between items-start mb-4">
                <h2 style={{ margin: 0 }}>{room.name}</h2>
                <div className="text-right">
                  <span className="text-gold" style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>₹{room.price}</span>
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
          ))
        )}
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
        .filter-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: transparent;
          border: none;
          color: var(--text-color);
          outline: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.95rem;
          padding-right: 0.5rem;
        }
        .filter-select option {
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        .filter-select:focus {
          outline: none;
        }
      `}</style>
    </motion.div>
  );
};

export default Rooms;
