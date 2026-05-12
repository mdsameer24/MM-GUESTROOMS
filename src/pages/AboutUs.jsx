import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container animate-fade-in"
      style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About <span className="text-gold">Us</span></h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Learn about our heritage, our vision, and our commitment to luxury hospitality.
        </p>
      </div>

      <div className="card-luxury" style={{ padding: '3rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-gold)' }}>Our Story</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="text-muted" style={{ lineHeight: '1.6' }}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </motion.div>
  );
};

export default AboutUs;
