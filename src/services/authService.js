import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import apiClient from '../api/axios';

console.log('🔗 Using REAL Authentication Service');
export const loginWithCredentials = async (emailOrUsername, password) => {
  try {
    const response = await apiClient.post('/Auth/login', {
      emailOrUsername,
      password
    });

    const data = response.data;
    
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('authMethod', 'credentials');
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response) {
      return { user: null, error: error.response.data.message || 'Email hoặc mật khẩu không chính xác' };
    }
    
    return { user: null, error: 'Không thể kết nối đến server' };
  }
};

// Google login → Firebase → Sync with your Database
export const loginWithGoogle = async () => {
  try {
    // 1. Firebase Google login
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    
    console.log('✅ Firebase Google login successful:', firebaseUser.email);
    
    // 2. Send Firebase user to your backend for sync
    const response = await apiClient.post('/Auth/google-sync', {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified
    });

    const data = response.data;
    
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('authMethod', 'google');
    
    console.log('✅ Database sync successful:', data.user);
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: 'Đăng nhập bị hủy' };
    } else if (error.code === 'auth/popup-blocked') {
      return { user: null, error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại' };
    }
    
    // Handle API errors
    if (error.response) {
      // Sign out from Firebase if database sync fails
      await firebaseSignOut(auth);
      return { user: null, error: error.response.data.message || 'Đồng bộ tài khoản thất bại' };
    }
    
    return { user: null, error: 'Đăng nhập Google thất bại' };
  }
};

// Register with email/password → Your Database
export const registerWithCredentials = async (userData) => {
  try {
    const response = await apiClient.post('/Auth/register', userData);

    const data = response.data;
    
    // Store token and user data
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('authMethod', 'credentials');
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Register error:', error);
    
    if (error.response) {
      return { user: null, error: error.response.data.message || 'Đăng ký thất bại' };
    }
    
    return { user: null, error: 'Không thể kết nối đến server' };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const authMethod = localStorage.getItem('authMethod');
    
    // Sign out from Firebase if user logged in via Google
    if (authMethod === 'google') {
      await firebaseSignOut(auth);
      console.log('✅ Firebase sign out successful');
    }
    
    // Call backend logout endpoint
    try {
      await apiClient.post('/Auth/logout');
    } catch (error) {
      console.warn('Backend logout failed:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('authMethod');
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Utility functions
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getAuthMethod = () => {
  return localStorage.getItem('authMethod') || 'credentials';
};