import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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

  const handleLogout = useCallback(async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
    }
    return result;
  }, []);
  
  const memoizedValue = useMemo(() => ({
    user,
    loading,
    login,
    updateUser,
    logout: handleLogout,
    isAuthenticated: isAuthenticated(),
    authMethod: getAuthMethod()
  }), [user, loading, handleLogout]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};