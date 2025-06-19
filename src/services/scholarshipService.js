import axios from '../api/axios'

export const scholarshipService = {
  // GET /api/Scholarships - Get all scholarships
  getAllScholarships: async () => {
    try {
      const response = await axios.get('/Scholarships')
      return response.data
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      throw error
    }
  },

  // GET /api/Scholarships/{id} - Get scholarship by id
  getScholarshipById: async (id) => {
    try {
      const response = await axios.get(`/Scholarships/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching scholarship by id:', error)
      throw error
    }
  },

  // GET /api/Scholarships/University/{universityId} - Get scholarships by university
  getScholarshipsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/Scholarships/University/${universityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching scholarships by university:', error)
      throw error
    }
  },

  // POST /api/Scholarships - Create new scholarship
  createScholarship: async (scholarshipData) => {
    try {
      const response = await axios.post('/Scholarships', scholarshipData)
      return response.data
    } catch (error) {
      console.error('Error creating scholarship:', error)
      throw error
    }
  },

  // PUT /api/Scholarships/{id} - Update scholarship
  updateScholarship: async (id, scholarshipData) => {
    try {
      const response = await axios.put(`/Scholarships/${id}`, { ...scholarshipData, id })
      return response.data
    } catch (error) {
      console.error('Error updating scholarship:', error)
      throw error
    }
  },

  // DELETE /api/Scholarships/{id} - Delete scholarship
  deleteScholarship: async (id) => {
    try {
      await axios.delete(`/Scholarships/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      throw error
    }
  }
}

export default scholarshipService 