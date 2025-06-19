import axios from '../api/axios'

export const majorsService = {
    // GET /api/Majors - Get all majors
    getAllMajors: async () => {
        try {
            const response = await axios.get('/Majors')
            return response.data
        } catch (error) {
            console.error('Error fetching majors:', error)
            throw error
        }
    },

    // GET /api/Majors/{id}
    getMajorById: async (id) => {
        try {
            const response = await axios.get(`/Majors/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching major by id:', error)
            throw error
        }
    },

    // GET /api/Majors/University/{universityId}
    getMajorsByUniversityId: async (universityId) => {
        try {
            const response = await axios.get(`/Majors/University/${universityId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching majors by university id:', error)
            throw error
        }
    },

    // POST /api/Majors
    createMajor: async (majorData) => { 
        try {
            const response = await axios.post('/Majors', majorData)
            return response.data
        } catch (error) {
            console.error('Error creating major:', error)
            throw error
        }
    },

    // PUT /api/Majors/{id}
    updateMajor: async (id, majorData) => {
        try {
            const response = await axios.put(`/Majors/${id}`, majorData)
            return response.data
        } catch (error) {
            console.error('Error updating major:', error)
            throw error
        }
    },

    // DELETE /api/Majors/{id}
    deleteMajor: async (id) => {
        try {
            await axios.delete(`/Majors/${id}`)
        } catch (error) {
            console.error('Error deleting major:', error)
            throw error
        }
    },

    // Helper function to search majors
    searchMajors: async (query, filters = {}) => {
        try {
            const majors = await majorsService.getAllMajors()

            let filtered = [...majors]

            // Filter by search query
            if (query) {
                filtered = filtered.filter(major =>
                    major.name.toLowerCase().includes(query.toLowerCase()) ||
                    major.description.toLowerCase().includes(query.toLowerCase())
                )
            }

            // Filter by university
            if (filters.university && filters.university !== 'clear') {
                filtered = filtered.filter(major => major.universityId === filters.university)
            }

            return filtered
        } catch (error) {
            console.error('Error searching majors:', error)
            throw error
        }
    }
}

export default majorsService