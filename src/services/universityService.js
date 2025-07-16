import axios from '../api/axios'

export const universityService = {
  getAllUniversities: async () => {
    try {
      const response = await axios.get('/Universities')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getUniversitiesByType: async (type) => {
    try {
      const response = await axios.get(`/Universities/type/${encodeURIComponent(type)}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getUniversityById: async (id) => {
    try {
      const response = await axios.get(`/Universities/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createUniversity: async (universityData) => {
    try {
      const response = await axios.post('/Universities', universityData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUniversity: async (id, universityData) => {
    try {
      const response = await axios.put(`/Universities/${id}`, { ...universityData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteUniversity: async (id) => {
    try {
      await axios.delete(`/Universities/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  searchUniversities: async (query, filters = {}) => {
    try {
      const universities = await universityService.getAllUniversities()
      
      let filtered = [...universities]

      if (query) {
        filtered = filtered.filter(uni =>
          uni.name.toLowerCase().includes(query.toLowerCase()) ||
          uni.shortName?.toLowerCase().includes(query.toLowerCase())
        )
      }

      if (filters.type && filters.type !== 'clear') {
        filtered = filtered.filter(uni => uni.type === filters.type)
      }

      if (filters.region && filters.region !== 'clear') {
        filtered = filtered.filter(uni => {
          if (typeof uni.locations === 'string') {
            return uni.locations.toLowerCase().includes(filters.region.toLowerCase())
          } else if (Array.isArray(uni.locations)) {
            return uni.locations.some(location => 
              location.toLowerCase().includes(filters.region.toLowerCase())
            )
          }
          return false
        })
      }

      return filtered
    } catch (error) {
      throw error
    }
  }
}

export default universityService 