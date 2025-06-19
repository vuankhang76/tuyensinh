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
      // Gọi API login của backend như bình thường
      const response = await apiClient.post('/Auth/login', {
        emailOrUsername,
        password
      });
  
      // Nếu thành công, luồng vẫn như cũ
      const data = response.data;
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authMethod', 'credentials');
      
      return { user: data.user, error: null };
  
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
  
        if (errorData.code === 'EMAIL_NOT_VERIFIED') {
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
    // Log để biết hàm đã được gọi và với dữ liệu gì
    console.log('--- Bắt đầu hàm registerWithEmailVerification ---', { userData });
  
    try {
      // --- BƯỚC 1: Cố gắng tạo người dùng trên Firebase ---
      console.log('BƯỚC 1: Đang thử tạo người dùng trên Firebase...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
  
      console.log('✅ BƯỚC 1 THÀNH CÔNG: Người dùng mới đã được tạo trên Firebase.', userCredential.user);
  
      const firebaseUser = userCredential.user;
  
      // --- BƯỚC 2: Tạo tài khoản trong database ngay lập tức (chưa verified) ---
      console.log('BƯỚC 2: Đang tạo tài khoản trong database...');
      try {
        const response = await apiClient.post('/Auth/register', {
          username: userData.username,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          firebaseUid: firebaseUser.uid,
          emailVerified: false, // Chưa verified
          password: userData.password
        });
        console.log('✅ BƯỚC 2 THÀNH CÔNG: Tài khoản đã được tạo trong database.');
      } catch (dbError) {
        console.error('❌ BƯỚC 2 THẤT BẠI: Lỗi khi tạo tài khoản trong database:', dbError);
        // Nếu không tạo được trong database, xóa tài khoản Firebase
        await firebaseUser.delete();
        throw new Error('Không thể tạo tài khoản trong hệ thống');
      }
  
      // --- BƯỚC 3: Gửi email xác minh cho người dùng mới ---
      console.log('BƯỚC 3: Đang yêu cầu Firebase gửi email xác minh...');
      await sendEmailVerification(firebaseUser);
      console.log('✅ BƯỚC 3 THÀNH CÔNG: Đã gửi yêu cầu.');
  
      // Trả về kết quả để UI chuyển hướng sang trang xác minh
      return {
        user: null,
        error: null,
        requiresEmailVerification: true,
        email: firebaseUser.email
      };
  
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        try {
          const signInResult = await signInWithEmailAndPassword(auth, userData.email, userData.password);
          if (!signInResult.user.emailVerified) {
            console.log('-> Tình huống: Người dùng tồn tại nhưng CHƯA xác minh. Gửi lại email.');
            await sendEmailVerification(signInResult.user);
            return {
              user: null,
              error: null,
              requiresEmailVerification: true,
              email: signInResult.user.email
            };
          } else {
            return { user: null, error: 'Email đã được sử dụng và đã xác minh' };
          }
        } catch (signInError) {
          if (signInError.code === 'auth/wrong-password') {
            return { user: null, error: 'Email này đã được đăng ký. Vui lòng kiểm tra lại mật khẩu.' };
          }
          if (signInError.code === 'auth/user-not-found') {
            return { user: null, error: 'Lỗi lạ: Email tồn tại nhưng không tìm thấy khi đăng nhập.' };
          }
          return { user: null, error: 'Email đã được sử dụng. Không thể đăng nhập tự động.' };
        }
      } else if (firebaseError.code === 'auth/weak-password') {
        return { user: null, error: 'Mật khẩu quá yếu, cần ít nhất 6 ký tự' };
      } else if (firebaseError.code === 'auth/invalid-email') {
        return { user: null, error: 'Email không hợp lệ' };
      }
  
      // Lỗi chung chưa được xử lý
      return { user: null, error: firebaseError.message || 'Có lỗi xảy ra khi tạo tài khoản' };
    }
  };

  export const completeRegistration = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { user: null, error: 'Không tìm thấy thông tin xác thực' };
      }
      
      const userData = JSON.parse(pendingData);
      
      const response = await apiClient.post('/Auth/register', {
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        firebaseUid: userData.firebaseUid,
        emailVerified: true,
        password: userData.password || null
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
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          await user.reload();
          resolve(user.emailVerified);
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
        // Firebase sẽ tự động xử lý việc gửi lại email cho người dùng đang đăng nhập
        await sendEmailVerification(user);
        return { success: true };
      }
      // Trường hợp này xảy ra nếu người dùng không còn trong phiên đăng nhập của Firebase
      return { success: false, error: 'Không tìm thấy phiên đăng nhập. Vui lòng thử đăng ký lại.' };
    } catch (error) {
      console.error("Resend email error:", error);
      if (error.code === 'auth/too-many-requests') {
          return { success: false, error: 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau.' };
      }
      return { success: false, error: 'Có lỗi xảy ra khi gửi email.' };
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