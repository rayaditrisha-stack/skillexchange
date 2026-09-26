import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Determine API Base URL for local vs deployment environments
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '';
  }
  return 'https://skillexchange-2-8uaj.onrender.com';
};

axios.defaults.baseURL = getBaseURL();
axios.defaults.withCredentials = true;

// Attach Bearer token from localStorage if present
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('skillmesh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
  // Initialize state strictly from local storage (default to null / guest mode)
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || localStorage.getItem('skillmesh_token') || null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const savedUser = localStorage.getItem('user') || localStorage.getItem('skillmesh_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('skillmesh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('skillmesh_user');
    setToken(null);
    setUser(null);
  };

  const saveAuth = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('skillmesh_token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('skillmesh_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  // Check auth status on mount
  const checkAuth = async () => {
    const currentToken = localStorage.getItem('token') || localStorage.getItem('skillmesh_token');
    if (!currentToken) {
      // Clean guest mode if no token in storage
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.success && res.data.user) {
        saveAuth(currentToken, res.data.user);
      } else {
        clearAuth();
      }
    } catch (err) {
      clearAuth();
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
      if (res.data && res.data.success) {
        const authToken = res.data.token || token;
        saveAuth(authToken, res.data.user);
        showToast(`Welcome back, ${res.data.user.name}! 👋`, 'success');
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Login failed.' };
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
      if (res.data && res.data.success) {
        const authToken = res.data.token || token;
        saveAuth(authToken, res.data.user);
        showToast(`Account created! You have been credited with 3 free Escrow Credits ⚡`, 'success');
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Registration failed.' };
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
    } finally {
      clearAuth();
      showToast('Logged out successfully.', 'info');
    }
  };

  // Refresh user profile
  const refreshUser = async () => {
    const currentToken = localStorage.getItem('token') || localStorage.getItem('skillmesh_token');
    if (!currentToken) return;
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.success) {
        saveAuth(currentToken, res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
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
