import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Hotel, User, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      borderTop: 'none', 
      borderLeft: 'none', 
      borderRight: 'none', 
      borderRadius: 0,
      backgroundColor: 'var(--bg-color)' 
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600 }}>
            <Hotel className="text-gold" size={28} />
            <span>MM Guest<span className="text-gold"> Rooms</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Rooms</NavLink>
            
            <button 
              onClick={toggleTheme} 
              className="btn-theme-toggle" 
              aria-label="Toggle theme"
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
            >
              {theme === 'dark' ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-gold" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 nav-link">
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>Logout</button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-nav-controls">
            <button onClick={toggleTheme} className="mr-4">
               {theme === 'dark' ? <Sun size={24} className="text-gold" /> : <Moon size={24} className="text-gold" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="mobile-menu glass-panel">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>Rooms</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn btn-outline mt-2 text-center">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost text-center">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav-controls { display: none; }
        .mobile-menu {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-color);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-controls { display: flex; align-items: center; }
        }
        .nav-link { font-weight: 500; font-size: 0.9rem; letter-spacing: 0.5px; text-transform: uppercase; }
        .nav-link:hover, .nav-link.active { color: var(--primary-gold); }
        .mr-4 { margin-right: 1rem; }
      `}</style>
    </nav>
  );
};

export default Navbar;
