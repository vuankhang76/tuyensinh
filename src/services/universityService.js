import axios from '../api/axios'

export const universityService = {
  // GET /api/Universities - Get all universities
  getAllUniversities: async () => {
    try {
      const response = await axios.get('/Universities')
      return response.data
    } catch (error) {
      console.error('Error fetching universities:', error)
      throw error
    }
  },

  // GET /api/Universities/type/{type} - Get universities by type
  getUniversitiesByType: async (type) => {
    try {
      const response = await axios.get(`/Universities/type/${encodeURIComponent(type)}`)
      return response.data
    } catch (error) {
      console.error('Error fetching universities by type:', error)
      throw error
    }
  },

  // GET /api/Universities/{id} - Get university by id
  getUniversityById: async (id) => {
    try {
      const response = await axios.get(`/Universities/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching university by id:', error)
      throw error
    }
  },

  // GET /api/Universities/{id}/details - Get university with details
  getUniversityDetails: async (id) => {
    try {
      const response = await axios.get(`/Universities/${id}/details`)
      return response.data
    } catch (error) {
      console.error('Error fetching university details:', error)
      throw error
    }
  },

  // POST /api/Universities - Create new university
  createUniversity: async (universityData) => {
    try {
      const response = await axios.post('/Universities', universityData)
      return response.data
    } catch (error) {
      console.error('Error creating university:', error)
      throw error
    }
  },

  // PUT /api/Universities/{id} - Update university
  updateUniversity: async (id, universityData) => {
    try {
      const response = await axios.put(`/Universities/${id}`, { ...universityData, id })
      return response.data
    } catch (error) {
      console.error('Error updating university:', error)
      throw error
    }
  },

  // DELETE /api/Universities/{id} - Delete university
  deleteUniversity: async (id) => {
    try {
      await axios.delete(`/Universities/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting university:', error)
      throw error
    }
  },

  // Helper function to search universities
  searchUniversities: async (query, filters = {}) => {
    try {
      const universities = await universityService.getAllUniversities()
      
      let filtered = [...universities]

      // Filter by search query
      if (query) {
        filtered = filtered.filter(uni =>
          uni.name.toLowerCase().includes(query.toLowerCase()) ||
          uni.shortName?.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Filter by type
      if (filters.type && filters.type !== 'clear') {
        filtered = filtered.filter(uni => uni.type === filters.type)
      }

      // Filter by location
      if (filters.region && filters.region !== 'clear') {
        filtered = filtered.filter(uni => 
          uni.locations?.some(location => 
            location.toLowerCase().includes(filters.region.toLowerCase())
          )
        )
      }

      return filtered
    } catch (error) {
      console.error('Error searching universities:', error)
      throw error
    }
  }
}

export default universityService 