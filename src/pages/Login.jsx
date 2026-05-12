import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const from = location.state?.returnTo || '/dashboard';
      navigate(from);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to process password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 160px)', padding: '4rem 1.5rem' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Hotel className="text-gold" size={40} />
          </div>
          <h2 className="font-serif">{isForgotPassword ? 'Reset Password' : 'Welcome Back'}</h2>
          <p className="text-muted">{isForgotPassword ? 'Enter your email to receive a reset link' : 'Sign in to your MM Guest Rooms account'}</p>
        </div>

        {resetSent ? (
          <div className="text-center animate-fade-in">
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Mail size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Check your email</h3>
            <p className="text-muted mb-6">If an account exists for <strong>{email}</strong>, we have sent password reset instructions.</p>
            <button onClick={() => { setIsForgotPassword(false); setResetSent(false); setEmail(''); }} className="btn btn-outline" style={{ width: '100%' }}>Back to Login</button>
          </div>
        ) : (
        <form onSubmit={isForgotPassword ? handleResetPassword : handleLogin} className="animate-fade-in">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {!isForgotPassword && (
          <div className="form-group mb-6 animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control" 
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          )}

          {error && <p className="error-text text-center mb-4">{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.875rem' }}
            disabled={isLoading}
          >
            {isLoading ? (isForgotPassword ? 'Sending...' : 'Signing in...') : (isForgotPassword ? 'Send Reset Link' : 'Sign In')}
          </button>
        </form>
        )}

        {!resetSent && (
        <div className="text-center mt-6">
          {isForgotPassword ? (
            <button onClick={() => { setIsForgotPassword(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>
              Back to Login
            </button>
          ) : (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Don't have an account? <Link to="/register" className="text-gold" style={{ fontWeight: 500 }}>Create one</Link>
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Login;
