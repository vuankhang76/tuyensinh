import axios from '../api/axios'

export const admissionMethodService = {
  // GET /api/AdmissionMethods - Get all admission methods
  getAllAdmissionMethods: async () => {
    try {
      const response = await axios.get('/AdmissionMethods')
      return response.data
    } catch (error) {
      console.error('Error fetching admission methods:', error)
      throw error
    }
  },

  // GET /api/AdmissionMethods/{id} - Get admission method by id
  getAdmissionMethodById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionMethods/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission method by id:', error)
      throw error
    }
  },

  // GET /api/AdmissionMethods/University/{universityId} - Get admission methods by university
  getAdmissionMethodsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AdmissionMethods/University/${universityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission methods by university:', error)
      throw error
    }
  },

  // POST /api/AdmissionMethods - Create new admission method
  createAdmissionMethod: async (methodData) => {
    try {
      const response = await axios.post('/AdmissionMethods', methodData)
      return response.data
    } catch (error) {
      console.error('Error creating admission method:', error)
      throw error
    }
  },

  // PUT /api/AdmissionMethods/{id} - Update admission method
  updateAdmissionMethod: async (id, methodData) => {
    try {
      const response = await axios.put(`/AdmissionMethods/${id}`, { ...methodData, id })
      return response.data
    } catch (error) {
      console.error('Error updating admission method:', error)
      throw error
    }
  },

  // DELETE /api/AdmissionMethods/{id} - Delete admission method
  deleteAdmissionMethod: async (id) => {
    try {
      await axios.delete(`/AdmissionMethods/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting admission method:', error)
      throw error
    }
  }
}

export default admissionMethodService 