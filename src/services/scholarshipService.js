import axios from '../api/axios'

export const scholarshipService = {
  getAllScholarships: async () => {
    try {
      const response = await axios.get('/Scholarships')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getScholarshipById: async (id) => {
    try {
      const response = await axios.get(`/Scholarships/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getScholarshipsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/Scholarships/University/${universityId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createScholarship: async (scholarshipData) => {
    try {
      const response = await axios.post('/Scholarships', scholarshipData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateScholarship: async (id, scholarshipData) => {
    try {
      const response = await axios.put(`/Scholarships/${id}`, { ...scholarshipData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteScholarship: async (id) => {
    try {
      await axios.delete(`/Scholarships/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default scholarshipService 