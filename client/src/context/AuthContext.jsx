import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
  });

  // Load user when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (authState.token) {
        try {
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            setAuthState(prev => ({ ...prev, user: response.data.data, loading: false }));
            return;
          }
        } catch (error) {
          console.error('Load user error:', error);
          localStorage.removeItem('token');
          setAuthState({ user: null, token: null, loading: false });
          return;
        }
      } else {
        setAuthState(prev => ({ ...prev, user: null, loading: false }));
      }
    };

    loadUser();
  }, [authState.token]);

  useEffect(() => {
    const handleAuthLogout = () => {
      localStorage.removeItem('token');
      setAuthState({ user: null, token: null, loading: false });
    };

    const handleStorage = (event) => {
      if (event.key === 'token') {
        setAuthState((prev) => ({
          ...prev,
          token: event.newValue,
          user: event.newValue ? prev.user : null,
        }));
      }
    };

    window.addEventListener('authLogout', handleAuthLogout);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('authLogout', handleAuthLogout);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Clear current state to avoid mixing data
      localStorage.removeItem('token');
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setAuthState({ user, token, loading: false });
        return { success: true };
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Email or password incorrect' 
      };
    }
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setAuthState({ user, token, loading: false });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({ user: null, token: null, loading: false });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success) {
        setAuthState(prev => ({ ...prev, user: response.data.data }));
        return { success: true, user: response.data.data };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Refresh failed' };
    }
  }, []);

  const setAuthenticatedUser = useCallback((user) => {
    setAuthState(prev => ({ ...prev, user }));
  }, []);

  const updateProfile = useCallback(async (updateData) => {
    try {
      const response = await api.put('/auth/profile', updateData);
      if (response.data.success) {
        setAuthState(prev => ({ ...prev, user: response.data.data }));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, updateProfile, refreshUser, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
