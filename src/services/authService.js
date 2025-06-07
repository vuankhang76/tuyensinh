import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || true;

if (USE_MOCK_API) {
  console.log('🔧 Using MOCK Authentication Service');
} else {
  console.log('🔗 Using REAL Authentication Service');
}

export * from './mockAuthService';
// Email/Password login → Your Database
// export const loginWithCredentials = async (emailOrUsername, password) => {
//   try {
//     const response = await fetch(`${API_BASE}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ emailOrUsername, password })
//     });

//     const data = await response.json();
    
//     if (response.ok) {
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       return { user: data.user, error: null };
//     } else {
//       return { user: null, error: data.message || 'Email hoặc mật khẩu không chính xác' };
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     return { user: null, error: 'Không thể kết nối đến server' };
//   }
// };

// // Google login → Firebase → Sync with your Database
// export const loginWithGoogle = async () => {
//   try {
//     // 1. Firebase Google login
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({
//       prompt: 'select_account'
//     });
    
//     const result = await signInWithPopup(auth, provider);
//     const firebaseUser = result.user;
    
//     console.log('✅ Firebase Google login successful:', firebaseUser.email);
    
//     // 2. Send Firebase user to your backend for sync
//     const response = await fetch(`${API_BASE}/auth/google-sync`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         firebaseUid: firebaseUser.uid,
//         email: firebaseUser.email,
//         displayName: firebaseUser.displayName,
//         photoURL: firebaseUser.photoURL,
//         emailVerified: firebaseUser.emailVerified
//       })
//     });

//     const data = await response.json();
    
//     if (response.ok) {
//       // Store your database user info
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       localStorage.setItem('authMethod', 'google'); // Track auth method
      
//       console.log('✅ Database sync successful:', data.user);
//       return { user: data.user, error: null };
//     } else {
//       // Sign out from Firebase if database sync fails
//       await firebaseSignOut(auth);
//       return { user: null, error: data.message || 'Đồng bộ tài khoản thất bại' };
//     }
//   } catch (error) {
//     console.error('Google login error:', error);
    
//     // Handle specific Firebase errors
//     if (error.code === 'auth/popup-closed-by-user') {
//       return { user: null, error: 'Đăng nhập bị hủy' };
//     } else if (error.code === 'auth/popup-blocked') {
//       return { user: null, error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại' };
//     }
    
//     return { user: null, error: 'Đăng nhập Google thất bại' };
//   }
// };

// // Register with email/password → Your Database
// export const registerWithCredentials = async (userData) => {
//   try {
//     const response = await fetch(`${API_BASE}/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData)
//     });

//     const data = await response.json();
    
//     if (response.ok) {
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       return { user: data.user, error: null };
//     } else {
//       return { user: null, error: data.message || 'Đăng ký thất bại' };
//     }
//   } catch (error) {
//     console.error('Register error:', error);
//     return { user: null, error: 'Không thể kết nối đến server' };
//   }
// };

// // Logout
// export const logoutUser = async () => {
//   try {
//     const authMethod = localStorage.getItem('authMethod');
    
//     // Sign out from Firebase if user logged in via Google
//     if (authMethod === 'google') {
//       await firebaseSignOut(auth);
//       console.log('✅ Firebase sign out successful');
//     }
    
//     // Clear local storage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('authMethod');
    
//     // Optional: Call backend logout endpoint
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         await fetch(`${API_BASE}/auth/logout`, {
//           method: 'POST',
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } catch (error) {
//         console.warn('Backend logout failed:', error);
//       }
//     }
    
//     return { success: true, error: null };
//   } catch (error) {
//     console.error('Logout error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Utility functions
// export const getCurrentUser = () => {
//   const userStr = localStorage.getItem('user');
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const getToken = () => {
//   return localStorage.getItem('token');
// };

// export const isAuthenticated = () => {
//   return !!localStorage.getItem('token');
// };

// export const getAuthMethod = () => {
//   return localStorage.getItem('authMethod') || 'credentials';
// };