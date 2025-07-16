import axios from '../api/axios'

export const admissionCriteriaService = {
  getAllAdmissionCriterias: async () => {
    try {
      const response = await axios.get('/AdmissionCriterias')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionCriteriaById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionCriterias/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAdmissionCriteriasByAdmissionMethod: async (admissionMethodId) => {
    try {
      const response = await axios.get(`/AdmissionCriterias/AdmissionMethod/${admissionMethodId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createAdmissionCriteria: async (criteriaData) => {
    try {
      const response = await axios.post('/AdmissionCriterias', criteriaData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateAdmissionCriteria: async (id, criteriaData) => {
    try {
      const response = await axios.put(`/AdmissionCriterias/${id}`, { ...criteriaData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteAdmissionCriteria: async (id) => {
    try {
      await axios.delete(`/AdmissionCriterias/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default admissionCriteriaService 