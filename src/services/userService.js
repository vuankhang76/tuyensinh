import axios from '../api/axios'

export const userService = {
  // GET /api/Users - Get all users (requires auth)
  getAllUsers: async () => {
    try {
      const response = await axios.get('/Users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`/Users/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user by id:', error)
      throw error
    }
  },

  updateUserByAdmin: async (id, body) => {
    try {
      await axios.put(`/Users/${id}/admin`, body)
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  updateUser: async (id, userData) => {
    try {
      await axios.put(`/Users/${id}`, { ...userData, id })
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // DELETE /api/Users/{id} - Delete user
  deleteUser: async (id) => {
    try {
      await axios.delete(`/Users/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  updateCurrentUser: (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Error updating current user in localStorage:', error)
      throw error
    }
  },

  getUserProfile: async () => {
    const currentUser = userService.getCurrentUser()
    if (currentUser && currentUser.id) {
      return userService.getUserById(currentUser.id)
    }
    throw new Error('No current user found')
  },

  updateUserProfile: async (profileData) => {
    const currentUser = userService.getCurrentUser()
    if (currentUser && currentUser.id) {
      await userService.updateUser(currentUser.id, profileData)
      
      const updatedUser = {
        ...currentUser,
        ...profileData
      }
      
      userService.updateCurrentUser(updatedUser)
      return updatedUser
    }
    throw new Error('No current user found')
  },

  changePassword: async (id, passwordData) => {
    try {
      const response = await axios.put(`/Users/${id}/change-password`, passwordData)
      return response.data
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  deleteAccount: async () => {
    const currentUser = userService.getCurrentUser()
    if (currentUser && currentUser.id) {
      await userService.deleteUser(currentUser.id)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      return true
    }
    throw new Error('No current user found')
  }
}

export default userService 