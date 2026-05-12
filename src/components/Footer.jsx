import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" style={{ 
      backgroundColor: 'var(--surface-color)', 
      borderTop: '1px solid var(--border-color)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
              <Hotel className="text-gold" size={28} />
              <span>MM Guest<span className="text-gold"> Rooms</span></span>
            </Link>
            <p className="text-muted" style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
              Experience unparalleled luxury and impeccable service at our exclusive properties around the world.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link instagram-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="social-link twitter-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600 }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/rooms" className="footer-link">Our Rooms</Link></li>
              <li><Link to="/experiences" className="footer-link">Experiences</Link></li>
              <li><Link to="/offers" className="footer-link">Special Offers</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600 }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/cancellation-policy" className="footer-link">Cancellation Policy</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600 }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} className="text-gold mt-1" style={{ flexShrink: 0 }} />
                <span>HITEC City, Madhapur<br/>Hyderabad, Telangana 500081</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Phone size={18} className="text-gold" style={{ flexShrink: 0 }} />
                <span>+1 (800) 123-4567</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Mail size={18} className="text-gold" style={{ flexShrink: 0 }} />
                <span>reservations@mmguestrooms.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          marginTop: '4rem', 
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} MM Guest Rooms. All rights reserved.
          </p>
          <div className="text-muted" style={{ fontSize: '0.875rem', display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>English (US)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>₹ INR</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 4rem; }
        }
        .footer-link {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--primary-gold);
        }
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .facebook-icon {
          background-color: #1877F2;
        }
        .instagram-icon {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
        }
        .twitter-icon {
          background-color: #1DA1F2;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
