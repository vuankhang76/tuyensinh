import axios from '../api/axios'

export const majorsService = {
    getAllMajors: async () => {
        try {
            const response = await axios.get('/Majors')
            return response.data
        } catch (error) {
            throw error
        }
    },

    getMajorById: async (id) => {
        try {
            const response = await axios.get(`/Majors/${id}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    getMajorsByUniversityId: async (universityId) => {
        try {
            const response = await axios.get(`/Majors/University/${universityId}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    createMajor: async (majorData) => { 
        try {
            const response = await axios.post('/Majors', majorData)
            return response.data
        } catch (error) {
            throw error
        }
    },

    updateMajor: async (id, majorData) => {
        try {
            const response = await axios.put(`/Majors/${id}`, majorData)
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteMajor: async (id) => {
        try {
            await axios.delete(`/Majors/${id}`)
        } catch (error) {
            throw error
        }
    },

    searchMajors: async (query, filters = {}) => {
        try {
            const majors = await majorsService.getAllMajors()

            let filtered = [...majors]

            if (query) {
                filtered = filtered.filter(major =>
                    major.name.toLowerCase().includes(query.toLowerCase()) ||
                    major.description.toLowerCase().includes(query.toLowerCase())
                )
            }

            if (filters.university && filters.university !== 'clear') {
                filtered = filtered.filter(major => major.universityId === filters.university)
            }

            return filtered
        } catch (error) {
            throw error
        }
    }
}

export default majorsService