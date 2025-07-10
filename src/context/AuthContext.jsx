import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getCurrentUser, isAuthenticated, getAuthMethod, logoutUser } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const authMethod = getAuthMethod();
      
      if (authMethod === 'google') {
        if (!firebaseUser && user) {
          handleLogout();
        }
      }
    });

    setLoading(false);

    return unsubscribe;
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  const value = {
    user,
    loading,
    login,
    updateUser,
    logout: handleLogout,
    isAuthenticated: isAuthenticated(),
    authMethod: getAuthMethod()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};