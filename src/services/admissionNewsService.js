import axios from '../api/axios'

export const admissionNewsService = {
  getAllAdmissionNews: async () => {
    try {
      const response = await axios.get('/AdmissionNews')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionNewsById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionNews/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionNewsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AdmissionNews/university/${universityId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getLatestAdmissionNews: async (count = 10) => {
    try {
      const response = await axios.get(`/AdmissionNews/latest/${count}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createAdmissionNews: async (newsData) => {
    try {
      const response = await axios.post('/AdmissionNews', newsData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateAdmissionNews: async (id, newsData) => {
    try {
      const response = await axios.put(`/AdmissionNews/${id}`, { ...newsData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteAdmissionNews: async (id) => {
    try {
      await axios.delete(`/AdmissionNews/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default admissionNewsService    