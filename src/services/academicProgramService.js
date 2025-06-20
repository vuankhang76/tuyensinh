import axios from '../api/axios'

export const academicProgramService = {
  // GET /api/AcademicPrograms - Get all academic programs
  getAllPrograms: async () => {
    try {
      const response = await axios.get('/AcademicPrograms')
      return response.data
    } catch (error) {
      console.error('Error fetching academic programs:', error)
      throw error
    }
  },

  // GET /api/AcademicPrograms/{id} - Get academic program by id
  getProgramById: async (id) => {
    try {
      const response = await axios.get(`/AcademicPrograms/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching academic program by id:', error)
      throw error
    }
  },

  // GET /api/AcademicPrograms/University/{universityId} - Get academic programs by university
  getProgramsByUniversity: async (universityId) => {
    try {
      const response = await axios.get(`/AcademicPrograms/University/${universityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching academic programs by university:', error)
      throw error
    }
  },

  // POST /api/AcademicPrograms - Create new academic program
  createProgram: async (programData) => {
    try {
      const response = await axios.post('/AcademicPrograms', programData)
      return response.data
    } catch (error) {
      console.error('Error creating academic program:', error)
      throw error
    }
  },

  // PUT /api/AcademicPrograms/{id} - Update academic program
  updateProgram: async (id, programData) => {
    try {
      const response = await axios.put(`/AcademicPrograms/${id}`, { ...programData, id })
      return response.data
    } catch (error) {
      console.error('Error updating academic program:', error)
      throw error
    }
  },

  // DELETE /api/AcademicPrograms/{id} - Delete academic program
  deleteProgram: async (id) => {
    try {
      await axios.delete(`/AcademicPrograms/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting academic program:', error)
      throw error
    }
  }
}

export default academicProgramService 