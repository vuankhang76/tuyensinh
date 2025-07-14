  import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth } from '../lib/firebase';
  import apiClient from '../api/axios';

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
      if (error.response && error.response.data) {
        const errorData = error.response.data;
  
        if (errorData.code === 'EMAIL_NOT_VERIFIED') {
          try {
            await signInWithEmailAndPassword(auth, errorData.email, password);
          } catch (firebaseError) {
              console.error('Lỗi đăng nhập Firebase:', firebaseError.message);
          }
          
          return {
            user: null,
            error: null,
            requiresEmailVerification: true,
            email: errorData.email,
            message: errorData.message
          };
        }
        
        return { user: null, error: errorData.message || 'Email hoặc mật khẩu không chính xác' };
      }
      
      return { user: null, error: 'Không thể kết nối đến server' };
    }
  };

  export const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
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
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { user: null, error: 'Đăng nhập bị hủy' };
      } else if (error.code === 'auth/popup-blocked') {
        return { user: null, error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại' };
      }
      
      if (error.response) {
        await firebaseSignOut(auth);
        return { user: null, error: error.response.data.message || 'Đồng bộ tài khoản thất bại' };
      }
      
      return { user: null, error: 'Đăng nhập Google thất bại' };
    }
  };

  export const  registerWithEmailVerification = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );  
      const firebaseUser = userCredential.user;
  
      try {
        const response = await apiClient.post('/Auth/register', {
          username: userData.username,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          firebaseUid: firebaseUser.uid,
          emailVerified: false, 
          password: userData.password
        });
      } catch (dbError) {
        try {
          await firebaseUser.delete();
        } catch (deleteError) {
          console.error('Failed to delete Firebase user:', deleteError);
        }
        
        const errorMessage = dbError.response?.data?.message || 'Lỗi lưu dữ liệu';
        return { user: null, error: errorMessage };
      }
  
      try {
        await sendEmailVerification(firebaseUser);  
      } catch (emailError) {
        if (emailError.code === 'auth/too-many-requests') {
          return { user: null, error: 'Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.' };
        }
        console.warn('Failed to send verification email:', emailError);
      }
      
      return {
        user: null,
        error: null,
        requiresEmailVerification: true,
        email: firebaseUser.email,
        isNewAccount: true
      };
  
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/too-many-requests') {
        return { user: null, error: 'Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.' };
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        try {
          const signInResult = await signInWithEmailAndPassword(auth, userData.email, userData.password);
          if (!signInResult.user.emailVerified) {
            try {
              await sendEmailVerification(signInResult.user);
            } catch (emailError) {
              if (emailError.code === 'auth/too-many-requests') {
                return { user: null, error: 'Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.' };
              }
              console.warn('Failed to send verification email:', emailError);
            }
            return {
              user: null,
              error: null,
              requiresEmailVerification: true,
              email: signInResult.user.email,
              isNewAccount: false
            };
          } else {
            return { user: null, error: 'Tài khoản đã tồn tại. Vui lòng đăng nhập' };
          }
        } catch (signInError) {
          if (signInError.code === 'auth/too-many-requests') {
            return {
              user: null,
              error: null,
              requiresEmailVerification: true,
              email: userData.email,
              isNewAccount: false
            };
          } else if (signInError.code === 'auth/wrong-password') {
            return { user: null, error: 'Email này đã được đăng ký. Vui lòng kiểm tra lại mật khẩu.' };
          } else if (signInError.code === 'auth/user-not-found') {
            return { user: null, error: 'Lỗi lạ: Email tồn tại nhưng không tìm thấy khi đăng nhập.' };
          }
          return { user: null, error: 'Email đã được sử dụng'};
        }
      } else if (firebaseError.code === 'auth/weak-password') {
        return { user: null, error: 'Mật khẩu quá yếu, cần ít nhất 6 ký tự' };
      } else if (firebaseError.code === 'auth/invalid-email') {
        return { user: null, error: 'Email không hợp lệ' };
      }
      return { user: null, error: firebaseError.message || 'Có lỗi xảy ra khi tạo tài khoản' };
    }
  };

  export const completeRegistration = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { user: null, error: 'Không tìm thấy thông tin xác thực' };
      }
      const response = await apiClient.put('/Auth/verify-email', {
        firebaseUid: currentUser.uid,
        email: currentUser.email
      });

      const data = response.data;
      
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authMethod', 'credentials');
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Complete registration error:', error);
      
      if (error.response) {
        return { user: null, error: error.response.data.message || 'Hoàn tất xác thực thất bại' };
      }
      
      return { user: null, error: 'Không thể kết nối đến server' };
    }
  };

  export const checkEmailVerificationStatus = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          try {
            await user.reload();
            resolve(user.emailVerified);
          } catch (error) {
            if (error.code === 'auth/too-many-requests') {
              reject(new Error('Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.'));
            } else {
              reject(error);
            }
          }
        } else {
          resolve(false);
        }
      });
    });
  };

  export const logoutUser = async () => {
    try {
      const authMethod = localStorage.getItem('authMethod');
      
      if (authMethod === 'google') {
        await firebaseSignOut(auth);
      }
      
      try {
        await apiClient.post('/Auth/logout');
      } catch (error) {
        console.warn('Backend logout failed:', error);
      }
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authMethod');
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  export const resendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;      
      if (user) {
        await sendEmailVerification(user);
        return { success: true };
      }
      return { success: false, error: 'Không tìm thấy phiên đăng nhập. Vui lòng thử đăng ký lại.' };
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.' };
      }
      return { success: false, error: error.message };
    }
  };

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