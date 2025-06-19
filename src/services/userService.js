import apiClient from '../api/axios';

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/User/profile');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Không thể lấy thông tin người dùng' 
    };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/User/profile', profileData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Không thể cập nhật thông tin người dùng' 
    };
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/User/change-password', passwordData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Change password error:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Không thể đổi mật khẩu' 
    };
  }
};

export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/User/account');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Delete account error:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Không thể xóa tài khoản' 
    };
  }
};

export const uploadProfilePhoto = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await apiClient.post('/User/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Upload profile photo error:', error);
    return { 
      data: null, 
      error: error.response?.data?.message || 'Không thể tải lên ảnh đại diện' 
    };
  }
}; 