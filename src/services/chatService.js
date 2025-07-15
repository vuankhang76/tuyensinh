import axios from '../api/axios'

export const chatService = {
  // Gửi tin nhắn và nhận phản hồi từ AI
  // POST /api/Chat/send
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await axios.post('/Chat/send', {
        message: message,
        sessionId: sessionId
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  // Lấy lịch sử chat của người dùng
  // GET /api/Chat/history
  getChatHistory: async () => {
    try {
      const response = await axios.get('/Chat/history')
      return response.data
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  },

  // Lấy chi tiết một phiên chat
  // GET /api/Chat/session/{sessionId}
  getChatSession: async (sessionId) => {
    try {
      const response = await axios.get(`/Chat/session/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat session:', error)
      throw error
    }
  },

  // Xóa một phiên chat
  // DELETE /api/Chat/session/{sessionId}
  deleteChatSession: async (sessionId) => {
    try {
      const response = await axios.delete(`/Chat/session/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting chat session:', error)
      throw error
    }
  },

  // Tạo phiên chat mới
  // POST /api/Chat/new-session
  createNewSession: async (title = null) => {
    try {
      const response = await axios.post('/Chat/new-session', title)
      return response.data
    } catch (error) {
      console.error('Error creating new session:', error)
      throw error
    }
  }
}

export default chatService 