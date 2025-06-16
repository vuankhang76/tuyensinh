// Mock users data
const MOCK_USERS = [
  {
    id: 1,
    username: 'student1',
    email: 'student@gmail.com',
    password: '123456',
    displayName: 'Nguyễn Văn A',
    role: 'student',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    provider: 'email'
  },
  {
    id: 2,
    username: 'hust_admin',
    email: 'admin@hust.edu.vn',
    password: '123456',
    displayName: 'Admin HUST',
    role: 'university',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    provider: 'email',
    universityId: 1
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@system.com',
    password: 'admin123',
    displayName: 'System Administrator',
    role: 'admin',
    photoURL: null,
    provider: 'email'
  }
];

const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
};

export const loginWithCredentials = async (emailOrUsername, password) => {
  await mockDelay(800);

  try {
    const user = MOCK_USERS.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && 
      u.password === password
    );

    if (!user) {
      return { user: null, error: 'Email hoặc mật khẩu không chính xác' };
    }

    const token = generateMockToken(user);
    const userResponse = { ...user };
    delete userResponse.password;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userResponse));
    localStorage.setItem('authMethod', 'credentials');

    return { user: userResponse, error: null };
  } catch (error) {
    return { user: null, error: 'Không thể kết nối đến server' };
  }
};

// Google login (still use Firebase for real Google auth)
export const loginWithGoogle = async () => {
  // Keep the real Firebase Google login
  const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
  const { auth } = await import('../lib/firebase');

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    
    await mockDelay(500);
    
    const mockUser = {
      id: Date.now(),
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: 'student',
      provider: 'google',
      firebaseUid: firebaseUser.uid
    };

    const token = generateMockToken(mockUser);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('authMethod', 'google');
    
    return { user: mockUser, error: null };
  } catch (error) {
    console.error('Google login error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: 'Đăng nhập bị hủy' };
    } else if (error.code === 'auth/popup-blocked') {
      return { user: null, error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại' };
    }
    
    return { user: null, error: 'Đăng nhập Google thất bại' };
  }
};

// Register
export const registerWithCredentials = async (userData) => {
  await mockDelay(1000);

  try {
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      return { user: null, error: 'Email đã được sử dụng' };
    }

    // Check if username already exists
    if (userData.username && MOCK_USERS.find(u => u.username === userData.username)) {
      return { user: null, error: 'Tên đăng nhập đã được sử dụng' };
    }

    // Create new user
    const newUser = {
      id: MOCK_USERS.length + 1,
      username: userData.username,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role || 'student',
      photoURL: null,
      provider: 'email',
      universityId: userData.universityId
    };

    // Add to mock database
    MOCK_USERS.push({ ...newUser, password: userData.password });

    const token = generateMockToken(newUser);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('authMethod', 'credentials');

    return { user: newUser, error: null };
  } catch (error) {
    return { user: null, error: 'Đăng ký thất bại' };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const authMethod = localStorage.getItem('authMethod');
    
    // Sign out from Firebase if user logged in via Google
    if (authMethod === 'google') {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      await signOut(auth);

    }
    
    // Clear local storage
    localStorage.removeItem('token');
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
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getAuthMethod = () => {
  return localStorage.getItem('authMethod') || 'credentials';
};

// Mock API function to get universities (for registration)
export const getUniversities = async () => {
  await mockDelay(500);
  
  return [
    { id: 1, name: 'Đại học Bách khoa Hà Nội', code: 'HUST' },
    { id: 2, name: 'Đại học FPT', code: 'FPU' },
    { id: 3, name: 'Đại học Kinh tế Quốc dân', code: 'NEU' }
  ];
};