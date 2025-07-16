import axios from '../api/axios'

export const admissionMethodService = {
  getAllAdmissionMethods: async () => {
    try {
      const response = await axios.get('/AdmissionMethods')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionMethodById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionMethods/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionMethodsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AdmissionMethods/University/${universityId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createAdmissionMethod: async (methodData) => {
    try {
      const response = await axios.post('/AdmissionMethods', methodData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateAdmissionMethod: async (id, methodData) => {
    try {
      const response = await axios.put(`/AdmissionMethods/${id}`, { ...methodData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteAdmissionMethod: async (id) => {
    try {
      await axios.delete(`/AdmissionMethods/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default admissionMethodService 