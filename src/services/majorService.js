import axios from '../api/axios'

export const majorService = {
  getAllMajors: async () => {
    try {
      const response = await axios.get('/Majors')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMajorById: async (id) => {
    try {
      const response = await axios.get(`/Majors/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMajorsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/Majors/University/${universityId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMajor: async (majorData) => {
    try {
      const response = await axios.post('/Majors', majorData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMajor: async (id, majorData) => {
    try {
      const response = await axios.put(`/Majors/${id}`, { ...majorData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMajor: async (id) => {
    try {
      await axios.delete(`/Majors/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default majorService 