import axios from '../api/axios'

export const admissionCriteriaService = {
  // GET /api/AdmissionCriterias - Get all admission criterias
  getAllAdmissionCriterias: async () => {
    try {
      const response = await axios.get('/AdmissionCriterias')
      return response.data
    } catch (error) {
      console.error('Error fetching admission criterias:', error)
      throw error
    }
  },

  // GET /api/AdmissionCriterias/{id} - Get admission criteria by id
  getAdmissionCriteriaById: async (id) => {
    try {
      const response = await axios.get(`/AdmissionCriterias/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission criteria by id:', error)
      throw error
    }
  },

  // GET /api/AdmissionCriterias/AdmissionMethod/{admissionMethodId} - Get admission criterias by admission method
  getAdmissionCriteriasByAdmissionMethod: async (admissionMethodId) => {
    try {
      const response = await axios.get(`/AdmissionCriterias/AdmissionMethod/${admissionMethodId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching admission criterias by admission method:', error)
      throw error
    }
  },

  // POST /api/AdmissionCriterias - Create new admission criteria
  createAdmissionCriteria: async (criteriaData) => {
    try {
      const response = await axios.post('/AdmissionCriterias', criteriaData)
      return response.data
    } catch (error) {
      console.error('Error creating admission criteria:', error)
      throw error
    }
  },

  // PUT /api/AdmissionCriterias/{id} - Update admission criteria
  updateAdmissionCriteria: async (id, criteriaData) => {
    try {
      const response = await axios.put(`/AdmissionCriterias/${id}`, { ...criteriaData, id })
      return response.data
    } catch (error) {
      console.error('Error updating admission criteria:', error)
      throw error
    }
  },

  // DELETE /api/AdmissionCriterias/{id} - Delete admission criteria
  deleteAdmissionCriteria: async (id) => {
    try {
      await axios.delete(`/AdmissionCriterias/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting admission criteria:', error)
      throw error
    }
  }
}

export default admissionCriteriaService 