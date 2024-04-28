import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/db';
import { isSupabaseActive } from '../services/supabaseConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('printf_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'user_customer_demo',
      name: 'Alex Johnson',
      email: 'customer@printf.com',
      phone: '+1 (555) 234-5678',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('printf_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('printf_active_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authService.loginWithGoogle();
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message || 'Google sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    setCurrentUser(null);
  };

  const switchRole = (role) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'user_admin_demo',
        name: 'Master Printer Admin',
        email: 'admin@printf.com',
        phone: '+1 (555) 987-6543',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    } else {
      setCurrentUser({
        id: 'user_customer_demo',
        name: 'Alex Johnson',
        email: 'customer@printf.com',
        phone: '+1 (555) 234-5678',
        role: 'customer',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        isSupabaseActive,
        login,
        register,
        loginWithGoogle,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
