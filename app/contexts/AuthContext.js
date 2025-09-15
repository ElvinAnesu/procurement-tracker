'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, USER_ROLES } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('procurement_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      const userData = { ...foundUser, password }; // Don't store password in real app
      setUser(userData);
      localStorage.setItem('procurement_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('procurement_user');
  };

  const switchUser = (userId) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      const userData = { ...foundUser, password: 'demo123' };
      setUser(userData);
      localStorage.setItem('procurement_user', JSON.stringify(userData));
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    login,
    logout,
    switchUser,
    hasRole,
    hasAnyRole,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
