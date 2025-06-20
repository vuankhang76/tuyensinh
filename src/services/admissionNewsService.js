import axios from '../api/axios'

export const admissionNewsService = {
  // GET /api/AdmissionNews - Get all admission news
  getAllAdmissionNews: async () => {
    try {
      const response = await axios.get('/AdmissionNews')
      return response.data
    } catch (error) {
      console.error('Error fetching admission news:', error)
      throw error
    }
  },

  // GET /api/AdmissionNews/{id} - Get admission news by id
  getAdmissionNewsById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionNews/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission news by id:', error)
      throw error
    }
  },

  // GET /api/AdmissionNews/university/{universityId} - Get admission news by university
  getAdmissionNewsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AdmissionNews/university/${universityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission news by university:', error)
      throw error
    }
  },

  // GET /api/AdmissionNews/latest/{count} - Get latest admission news
  getLatestAdmissionNews: async (count = 10) => {
    try {
      const response = await axios.get(`/AdmissionNews/latest/${count}`)
      return response.data
    } catch (error) {
      console.error('Error fetching latest admission news:', error)
      throw error
    }
  },

  // POST /api/AdmissionNews - Create new admission news
  createAdmissionNews: async (newsData) => {
    try {
      const response = await axios.post('/AdmissionNews', newsData)
      return response.data
    } catch (error) {
      console.error('Error creating admission news:', error)
      throw error
    }
  },

  // PUT /api/AdmissionNews/{id} - Update admission news
  updateAdmissionNews: async (id, newsData) => {
    try {
      const response = await axios.put(`/AdmissionNews/${id}`, { ...newsData, id })
      return response.data
    } catch (error) {
      console.error('Error updating admission news:', error)
      throw error
    }
  },

  // DELETE /api/AdmissionNews/{id} - Delete admission news
  deleteAdmissionNews: async (id) => {
    try {
      await axios.delete(`/AdmissionNews/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting admission news:', error)
      throw error
    }
  }
}

export default admissionNewsService    