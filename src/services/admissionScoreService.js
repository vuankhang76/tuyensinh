import axios from '../api/axios'

export const admissionScoreService = {
    // GET /api/AdmissionScores - Get all admission scores
    getAllAdmissionScores: async () => {
        try {
            const response = await axios.get('/AdmissionScores')
            return response.data
        } catch (error) {
            console.error('Error fetching admission scores:', error)
            throw error
        }
    },

    // GET /api/AdmissionScores/{id} - Get admission score by id
    getAdmissionScoreById: async (id) => {
        try {
            const response = await axios.get(`/AdmissionScores/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching admission score by id:', error)
            throw error
        }
    },

    // GET /api/AdmissionScores/major/{majorId} - Get admission scores by major
    getAdmissionScoresByMajor: async (majorId) => {
        try {
            const response = await axios.get(`/AdmissionScores/major/${majorId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching admission scores by major:', error)
            throw error
        }
    },

    // GET /api/AdmissionScores/year/{year} - Get admission scores by year
    getAdmissionScoresByYear: async (year) => {
        try {
            const response = await axios.get(`/AdmissionScores/year/${year}`)
            return response.data
        } catch (error) {
            console.error('Error fetching admission scores by year:', error)
            throw error
        }
    },

    // GET /api/AdmissionScores/major/{majorId}/year/{year} - Get admission scores by major and year
    getAdmissionScoresByMajorAndYear: async (majorId, year) => {
        try {
            const response = await axios.get(`/AdmissionScores/major/${majorId}/year/${year}`)
            return response.data
        } catch (error) {
            console.error('Error fetching admission scores by major and year:', error)
            throw error
        }
    },

    // POST /api/AdmissionScores - Create new admission score
    createAdmissionScore: async (scoreData) => {
        try {
            const response = await axios.post('/AdmissionScores', scoreData)
            return response.data
        } catch (error) {
            console.error('Error creating admission score:', error)
            throw error
        }
    },

    // PUT /api/AdmissionScores/{id} - Update admission score
    updateAdmissionScore: async (id, scoreData) => {
        try {
            const response = await axios.put(`/AdmissionScores/${id}`, { ...scoreData, id })
            return response.data
        } catch (error) {
            console.error('Error updating admission score:', error)
            throw error
        }
    },

    // DELETE /api/AdmissionScores/{id} - Delete admission score
    deleteAdmissionScore: async (id) => {
        try {
            await axios.delete(`/AdmissionScores/${id}`)
            return true
        } catch (error) {
            console.error('Error deleting admission score:', error)
            throw error
        }
    },

    // GET /api/AdmissionScores/exists/{id} - Check if admission score exists
    checkAdmissionScoreExists: async (id) => {
        try {
            const response = await axios.get(`/AdmissionScores/exists/${id}`)
            return response.data
        } catch (error) {
            console.error('Error checking admission score existence:', error)
            throw error
        }
    },

    // Helper function to search admission scores
    searchAdmissionScores: async (query, filters = {}) => {
        try {
            const admissionScores = await admissionScoreService.getAllAdmissionScores()

            let filtered = [...admissionScores]

            // Filter by search query
            if (query) {
                filtered = filtered.filter(admissionScore =>
                    admissionScore.name.toLowerCase().includes(query.toLowerCase()) ||
                    admissionScore.description.toLowerCase().includes(query.toLowerCase())
                )
            }

            // Filter by major
            if (filters.major && filters.major !== 'clear') {
                filtered = filtered.filter(admissionScore => admissionScore.majorId === filters.major)
            }

            // Filter by year
            if (filters.year && filters.year !== 'clear') {
                filtered = filtered.filter(admissionScore => admissionScore.year === filters.year)
            }

            return filtered
        } catch (error) {
            console.error('Error searching admission scores:', error)
            throw error
        }
    }
}

export default admissionScoreService