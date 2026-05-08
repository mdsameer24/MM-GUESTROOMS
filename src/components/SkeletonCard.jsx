import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="room-card skeleton">
      <div className="room-img-container skeleton-img"></div>
      <div className="room-info">
        <div className="room-header">
          <div className="skeleton-line" style={{ width: '70%', height: '16px' }}></div>
          <div className="skeleton-line" style={{ width: '15%', height: '16px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '40%', height: '14px', marginTop: '8px' }}></div>
        <div className="skeleton-line" style={{ width: '30%', height: '16px', marginTop: '12px' }}></div>
      </div>
      <style>{`
        .skeleton-img {
          background: #f0f0f0;
          overflow: hidden;
          position: relative;
        }
        .skeleton-line {
          background: #f0f0f0;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .skeleton-img::after, .skeleton-line::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
