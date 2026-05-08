import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Rooms = lazy(() => import('./pages/Rooms'));
const RoomDetails = lazy(() => import('./pages/RoomDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Loading Fallback
const PageLoader = () => (
  <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="loader"></div>
    <style>{`
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid var(--border-color);
        border-top: 5px solid var(--primary-gold);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <AppContent />
          </Router>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
