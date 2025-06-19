import axios from '../api/axios'

export const chatService = {
  // Chat Sessions
  // GET /api/ChatSessions - Get all chat sessions for current user
  getAllChatSessions: async () => {
    try {
      const response = await axios.get('/ChatSessions')
      return response.data
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      throw error
    }
  },

  // GET /api/ChatSessions/{id} - Get chat session by id
  getChatSessionById: async (id) => {
    try {
      const response = await axios.get(`/ChatSessions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat session by id:', error)
      throw error
    }
  },

  // POST /api/ChatSessions - Create new chat session
  createChatSession: async (sessionData) => {
    try {
      const response = await axios.post('/ChatSessions', sessionData)
      return response.data
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw error
    }
  },

  // PUT /api/ChatSessions/{id} - Update chat session
  updateChatSession: async (id, sessionData) => {
    try {
      const response = await axios.put(`/ChatSessions/${id}`, { ...sessionData, id })
      return response.data
    } catch (error) {
      console.error('Error updating chat session:', error)
      throw error
    }
  },

  // DELETE /api/ChatSessions/{id} - Delete chat session
  deleteChatSession: async (id) => {
    try {
      await axios.delete(`/ChatSessions/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting chat session:', error)
      throw error
    }
  },

  // Chat Messages
  // GET /api/ChatMessages/session/{sessionId} - Get messages for a chat session
  getMessagesBySession: async (sessionId) => {
    try {
      const response = await axios.get(`/ChatMessages/session/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching messages by session:', error)
      throw error
    }
  },

  // GET /api/ChatMessages/{id} - Get message by id
  getMessageById: async (id) => {
    try {
      const response = await axios.get(`/ChatMessages/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching message by id:', error)
      throw error
    }
  },

  // POST /api/ChatMessages - Create new message
  createMessage: async (messageData) => {
    try {
      const response = await axios.post('/ChatMessages', messageData)
      return response.data
    } catch (error) {
      console.error('Error creating message:', error)
      throw error
    }
  },

  // PUT /api/ChatMessages/{id} - Update message
  updateMessage: async (id, messageData) => {
    try {
      const response = await axios.put(`/ChatMessages/${id}`, { ...messageData, id })
      return response.data
    } catch (error) {
      console.error('Error updating message:', error)
      throw error
    }
  },

  // DELETE /api/ChatMessages/{id} - Delete message
  deleteMessage: async (id) => {
    try {
      await axios.delete(`/ChatMessages/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  },

  // Helper methods for common chat operations
  startNewChat: async (title = null) => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const sessionData = {
      userId: currentUser.id,
      title: title || `Chat ${new Date().toLocaleString()}`,
      startedAt: new Date().toISOString()
    }

    return await chatService.createChatSession(sessionData)
  },

  sendMessage: async (sessionId, message, sender = 'User') => {
    const messageData = {
      chatSessionId: sessionId,
      sender: sender,
      message: message,
      sentAt: new Date().toISOString()
    }

    return await chatService.createMessage(messageData)
  },

  getChatHistory: async (sessionId) => {
    try {
      const messages = await chatService.getMessagesBySession(sessionId)
      return messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
    } catch (error) {
      console.error('Error getting chat history:', error)
      throw error
    }
  }
}

export default chatService 