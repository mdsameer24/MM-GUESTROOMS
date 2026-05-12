import React from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container animate-fade-in"
      style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Frequently Asked <span className="text-gold">Questions</span></h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Find answers to common questions about booking, amenities, and policies.
        </p>
      </div>

      <div className="card-luxury" style={{ padding: '3rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-gold)' }}>General Information</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          <strong>Q: Lorem ipsum dolor sit amet?</strong><br />
          A: Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="text-muted" style={{ lineHeight: '1.6' }}>
          <strong>Q: Ut enim ad minim veniam?</strong><br />
          A: Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
        </p>
      </div>
    </motion.div>
  );
};

export default FAQ;
