/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Verify token is still valid by making a request with it
          const response = await api.get('/auth/me');
          const userData = response.data.data || response.data;
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear storage
          console.log('Token invalid, clearing auth');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const data = response.data.data || response.data;
      const token = data.token || data.access_token;
      const userData = data.user || {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Clear cart from previous user session
      localStorage.removeItem('cart');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event('cartUpdated'));
      return userData;
    } catch (error) {
      console.error('Login error in AuthContext:', error.response?.data);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const data = response.data.data || response.data;
    const token = data.token || data.access_token;
    const user = data.user || {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    
    // Clear cart from previous session
    localStorage.removeItem('cart');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === 'admin',
    isChef: user?.role?.toLowerCase() === 'chef',
    isCustomer: user?.role?.toLowerCase() === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
