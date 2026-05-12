import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, MapPin } from 'lucide-react';

const RoomCard = memo(({ room }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/room/${room.id}`} className="room-card">
        <div className="room-img-container">
          <img 
            src={room.imageUrl} 
            alt={room.name} 
            className="room-img" 
            loading="lazy" 
          />
          {room.isGuestFavorite && (
            <div className="badge-favorite">Guest Favorite</div>
          )}
          <button 
            className="heart-btn" 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              // Handle favorite logic
            }}
            aria-label="Add to favorites"
          >
            <Heart size={24} />
          </button>
        </div>
        <div className="room-info">
          <div className="room-header">
            <span className="room-title">{room.name}</span>
            <div className="room-rating">
              <Star size={14} fill="currentColor" />
              <span>{room.rating}</span>
            </div>
          </div>
          <span className="room-location flex items-center gap-1">
            <MapPin size={12} /> {room.location}
          </span>
          <div className="room-price">
            <span className="room-price-val">₹{room.price}</span>
            <span style={{ color: 'var(--text-muted)' }}> night</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

RoomCard.displayName = 'RoomCard';

export default RoomCard;
