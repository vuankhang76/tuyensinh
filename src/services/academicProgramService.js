import axios from '../api/axios'

export const academicProgramService = {
  getAllPrograms: async () => {
    try {
      const response = await axios.get('/AcademicPrograms')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getProgramById: async (id) => {
      const response = await axios.get(`/AcademicPrograms/${id}`)
      return response.data
  },

  getProgramsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AcademicPrograms/University/${universityId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createProgram: async (programData) => {
    try {
      const response = await axios.post('/AcademicPrograms', programData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateProgram: async (id, programData) => {
    try {
      const response = await axios.put(`/AcademicPrograms/${id}`, { ...programData, id })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteProgram: async (id) => {
    try {
      await axios.delete(`/AcademicPrograms/${id}`)
      return true
    } catch (error) {
      throw error
    }
  }
}

export default academicProgramService 