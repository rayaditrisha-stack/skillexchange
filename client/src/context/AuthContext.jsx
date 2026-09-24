import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Determine API Base URL for local vs deployment environments
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running locally, Vite proxy handles /api
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '';
  }
  // Live deployment fallback to Render backend
  return 'https://skillexchange-2-8uaj.onrender.com';
};

axios.defaults.baseURL = getBaseURL();
axios.defaults.withCredentials = true;

// Attach Bearer token from localStorage if present (for browsers blocking cross-site cookies)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillmesh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Check auth status on mount
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('skillmesh_token', res.data.token);
        }
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}! 👋`, 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Demo Login helper
  const demoLogin = async (email) => {
    return login(email, 'Password123!');
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('skillmesh_token', res.data.token);
        }
        setUser(res.data.user);
        showToast(`Account created! You have been credited with 3 free Escrow Credits ⚡`, 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout').catch(() => {});
      localStorage.removeItem('skillmesh_token');
      setUser(null);
      showToast('Logged out successfully.', 'info');
    } catch (err) {
      localStorage.removeItem('skillmesh_token');
      setUser(null);
    }
  };

  // Refresh user profile
  const refreshUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toast,
        setToast,
        showToast,
        login,
        demoLogin,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
