import axios from '../api/axios'

export const chatService = {
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await axios.post('/Chat/send', {
        message: message,
        sessionId: sessionId
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getChatHistory: async () => {
    try {
      const response = await axios.get('/Chat/history')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getChatSession: async (sessionId) => {
    try {
      const response = await axios.get(`/Chat/session/${sessionId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteChatSession: async (sessionId) => {
    try {
      const response = await axios.delete(`/Chat/session/${sessionId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createNewSession: async (title = null) => {
    try {
      const response = await axios.post('/Chat/new-session', title)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateSessionTitle: async (sessionId, title) => {
    try {
      const response = await axios.put(`/Chat/session/${sessionId}/title`, {
        title: title
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default chatService 