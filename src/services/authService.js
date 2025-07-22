  import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode,
    fetchSignInMethodsForEmail,
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
          await signInWithEmailAndPassword(auth, errorData.email, password);
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

  export const registerWithEmailVerification = async (userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        const firebaseUser = userCredential.user;

        try {
            await apiClient.post('/Auth/register', {
                username: userData.username,
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
                firebaseUid: firebaseUser.uid,
                password: userData.password
            });
        } catch (dbError) {
            await firebaseUser.delete();
            const errorMessage = dbError.response?.data?.message || 'Lỗi lưu dữ liệu';
            return { error: errorMessage };
        }
          await sendEmailVerification(firebaseUser);
        return {
            error: null,
            requiresEmailVerification: true,
            isNewAccount: true,
            email: firebaseUser.email,
        };

    } catch (firebaseError) {
        if (firebaseError.code === 'auth/email-already-in-use') {
            return { error: 'email_already_exists' }; 
        } else if (firebaseError.code === 'auth/weak-password') {
            return { error: 'Mật khẩu quá yếu, cần ít nhất 6 ký tự' };
        } else if (firebaseError.code === 'auth/invalid-email') {
            return { error: 'Email không hợp lệ' };
        }
        return { error: firebaseError.message || 'Có lỗi xảy ra khi tạo tài khoản' };
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
            resolve(false);
          }
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
      
        await apiClient.post('/Auth/logout');
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authMethod');
      
      return { success: true, error: null };
    } catch (error) {
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

  export const checkAccountType = async (email) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const response = await apiClient.get(`/Auth/check-availability?email=${encodeURIComponent(normalizedEmail)}`);
      if (!response.data.exists) {
        return { 
          exists: false,
          accountType: null,
          error: 'Không tìm thấy tài khoản với email này'
        };
      }

      const { provider, hasPassword } = response.data;
      
      let accountType = 'unknown';
      let canResetPassword = false;
      
      if (provider === 'google' && !hasPassword) {
        accountType = 'google';
        canResetPassword = false;
      } else if (provider === 'google' && hasPassword) {
        accountType = 'mixed';
        canResetPassword = true;
      } else if (provider === 'email' || hasPassword) {
        accountType = 'email';
        canResetPassword = true;
      }
      
      return {
        exists: true,
        accountType,
        provider,
        hasPassword,
        canResetPassword
      };
    } catch (error) {
      return {
        exists: false,
        accountType: null,
        error: 'Có lỗi xảy ra khi kiểm tra loại tài khoản'
      };
    }
  };

  export const sendPasswordReset = async (email) => {
    try {
      const accountCheck = await checkAccountType(email);
      
      if (!accountCheck.exists) {
        return { 
          success: false, 
          error: accountCheck.error || 'Không tìm thấy tài khoản với email này' 
        };
      }

      if (accountCheck.accountType === 'google') {
        return { 
          success: false, 
          error: 'Tài khoản này được đăng ký bằng Google. Vui lòng sử dụng "Đăng nhập với Google"',
          isGoogleAccount: true,
          accountType: 'google'
        };
      }

      if (!accountCheck.canResetPassword) {
        return { 
          success: false, 
          error: 'Tài khoản này không hỗ trợ reset mật khẩu'
        };
      }

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/dang-nhap`,
        handleCodeInApp: false
      });
      
      return { 
        success: true, 
        message: 'Email reset mật khẩu đã được gửi',
        accountType: accountCheck.accountType
      };
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi gửi email reset mật khẩu';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  export const verifyResetCode = async (code) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return { success: true, email };
    } catch (error) {
      let errorMessage = 'Mã reset không hợp lệ hoặc đã hết hạn';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Mã reset đã hết hạn';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Mã reset không hợp lệ';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Tài khoản đã bị vô hiệu hóa';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  export const confirmPasswordResetWithCode = async (code, newPassword) => {
    try {
      const verifyResult = await verifyResetCode(code);
      if (!verifyResult.success) {
        return verifyResult;
      }

      await confirmPasswordReset(auth, code, newPassword);

      try {
        await apiClient.put('/Auth/update-password-after-reset', {
          email: verifyResult.email,
          newPassword: newPassword
        });
      } catch (backendError) {
      }

      return { success: true, message: 'Mật khẩu đã được đặt lại thành công' };
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi đặt lại mật khẩu';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Mã reset đã hết hạn';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Mã reset không hợp lệ';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      return { success: false, error: errorMessage };
    }
  };