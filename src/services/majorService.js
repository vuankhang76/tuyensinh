import axios from '../api/axios'

export const majorService = {
  // GET /api/Majors - Get all majors
  getAllMajors: async () => {
    try {
      const response = await axios.get('/Majors')
      return response.data
    } catch (error) {
      console.error('Error fetching majors:', error)
      throw error
    }
  },

  // GET /api/Majors/{id} - Get major by id
  getMajorById: async (id) => {
    try {
      const response = await axios.get(`/Majors/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching major by id:', error)
      throw error
    }
  },

  // GET /api/Majors/University/{universityId} - Get majors by university
  getMajorsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/Majors/University/${universityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching majors by university:', error)
      throw error
    }
  },

  // POST /api/Majors - Create new major
  createMajor: async (majorData) => {
    try {
      const response = await axios.post('/Majors', majorData)
      return response.data
    } catch (error) {
      console.error('Error creating major:', error)
      throw error
    }
  },

  // PUT /api/Majors/{id} - Update major
  updateMajor: async (id, majorData) => {
    try {
      const response = await axios.put(`/Majors/${id}`, { ...majorData, id })
      return response.data
    } catch (error) {
      console.error('Error updating major:', error)
      throw error
    }
  },

  // DELETE /api/Majors/{id} - Delete major
  deleteMajor: async (id) => {
    try {
      await axios.delete(`/Majors/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting major:', error)
      throw error
    }
  }
}

export default majorService 