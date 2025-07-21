import axios from '../api/axios'

export const universityViewService = {
  getMyUniversity: async () => {
    try {
      const response = await axios.get('/UniversityView/my-university')
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyUniversity: async (universityData) => {
    try {
      const response = await axios.put('/UniversityView/my-university', universityData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyUniversityLogo: async (logoData) => {
    try {
      const response = await axios.put('/UniversityView/my-university/logo', logoData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMyPrograms: async () => {
    try {
      const response = await axios.get('/UniversityView/my-programs')
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyProgram: async (programData) => {
    try {
      const response = await axios.post('/UniversityView/my-programs', programData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyProgram: async (id, programData) => {
    try {
      const response = await axios.put(`/UniversityView/my-programs/${id}`, programData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyProgram: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-programs/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyMajors: async () => {
    try {
      const response = await axios.get('/UniversityView/my-majors')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMyMajorsPaged: async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/UniversityView/my-majors/paged?page=${page}&pageSize=${pageSize}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyMajor: async (majorData) => {
    try {
      const response = await axios.post('/UniversityView/my-majors', majorData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyMajor: async (id, majorData) => {
    try {
      const response = await axios.put(`/UniversityView/my-majors/${id}`, majorData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyMajor: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-majors/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionMethods: async () => {
    try {
      const response = await axios.get('/UniversityView/my-admission-methods')
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyAdmissionMethod: async (methodData) => {
    try {
      const response = await axios.post('/UniversityView/my-admission-methods', methodData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyAdmissionMethod: async (id, methodData) => {
    try {
      const response = await axios.put(`/UniversityView/my-admission-methods/${id}`, methodData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyAdmissionMethod: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-admission-methods/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionScores: async () => {
    try {
      const response = await axios.get('/UniversityView/my-admission-scores')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionScoresPaged: async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/UniversityView/my-admission-scores/paged?page=${page}&pageSize=${pageSize}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionScoresByYear: async (year) => {
    try {
      const response = await axios.get(`/UniversityView/my-admission-scores/year/${year}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyAdmissionScore: async (scoreData) => {
    try {
      const response = await axios.post('/UniversityView/my-admission-scores', scoreData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyAdmissionScore: async (id, scoreData) => {
    try {
      const response = await axios.put(`/UniversityView/my-admission-scores/${id}`, scoreData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyAdmissionScore: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-admission-scores/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionCriteria: async () => {
    try {
      const response = await axios.get('/UniversityView/my-admission-criteria')
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyAdmissionCriteria: async (criteriaData) => {
    try {
      const response = await axios.post('/UniversityView/my-admission-criteria', criteriaData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyAdmissionCriteria: async (id, criteriaData) => {
    try {
      const response = await axios.put(`/UniversityView/my-admission-criteria/${id}`, criteriaData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyAdmissionCriteria: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-admission-criteria/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyAdmissionNews: async () => {
    try {
      const response = await axios.get('/UniversityView/my-admission-news')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMyNews: async () => {
    try {
      const response = await axios.get('/UniversityView/my-news')
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyAdmissionNews: async (newsData) => {
    try {
      const response = await axios.post('/UniversityView/my-admission-news', newsData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyAdmissionNews: async (id, newsData) => {
    try {
      const response = await axios.put(`/UniversityView/my-admission-news/${id}`, newsData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyAdmissionNews: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-admission-news/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  getMyScholarships: async () => {
    try {
      const response = await axios.get('/UniversityView/my-scholarships')
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMyScholarship: async (scholarshipData) => {
    try {
      const response = await axios.post('/UniversityView/my-scholarships', scholarshipData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMyScholarship: async (id, scholarshipData) => {
    try {
      const response = await axios.put(`/UniversityView/my-scholarships/${id}`, scholarshipData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMyScholarship: async (id) => {
    try {
      await axios.delete(`/UniversityView/my-scholarships/${id}`)
      return true
    } catch (error) {
      throw error
    }
  },

  updateMyVerify: async () => {
    try {
      const response = await axios.post(`/UniversityView/verify-my-university`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default universityViewService 