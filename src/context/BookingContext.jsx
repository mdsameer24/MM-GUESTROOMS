import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Top Picks');

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await apiClient.get('/rooms');
        // Convert IDs to strings for frontend compatibility if needed, or just use as is
        const formattedRooms = response.data.map(room => ({
          ...room,
          id: String(room.id)
        }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Fetch user bookings when user changes
  const fetchUserBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }
    try {
      const response = await apiClient.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Top Picks' ? true : room.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [rooms, searchQuery, activeCategory]);

  const getRoomById = (id) => rooms.find(r => r.id === String(id));

  const getUserBookings = () => bookings;

  const createBooking = async (roomId, checkIn, checkOut, totalAmount) => {
    if (!user) throw new Error('You must be logged in to book a room.');

    setLoading(true);
    try {
      const response = await apiClient.post('/bookings', {
        roomId: parseInt(roomId, 10),
        checkIn,
        checkOut,
        totalAmount
      });
      setBookings(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      await apiClient.delete(`/bookings/${bookingId}`);
      // Refresh bookings from server to ensure state is accurate
      await fetchUserBookings();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const getRecentGuestsForRoom = async (roomId) => {
    try {
      const response = await apiClient.get(`/rooms/${roomId}/recent-guests`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent guests', error);
      return [];
    }
  };

  const value = {
    rooms,
    filteredRooms,
    bookings,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    getRoomById,
    getUserBookings,
    createBooking,
    cancelBooking,
    getRecentGuestsForRoom,
    loading
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
