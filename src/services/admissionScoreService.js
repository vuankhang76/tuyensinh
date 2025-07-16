import axios from '../api/axios'

export const admissionScoreService = {
    getAllAdmissionScores: async () => {
        try {
            const response = await axios.get('/AdmissionScores')
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAdmissionScoreById: async (id) => {
        try {
            const response = await axios.get(`/AdmissionScores/${id}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAdmissionScoresByMajor: async (majorId) => {
        try {
            const response = await axios.get(`/AdmissionScores/major/${majorId}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAdmissionScoresByYear: async (year) => {
        try {
            const response = await axios.get(`/AdmissionScores/year/${year}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAdmissionScoresByMajorAndYear: async (majorId, year) => {
        try {
            const response = await axios.get(`/AdmissionScores/major/${majorId}/year/${year}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    createAdmissionScore: async (scoreData) => {
        try {
            const response = await axios.post('/AdmissionScores', scoreData)
            return response.data
        } catch (error) {
            throw error
        }
    },

    updateAdmissionScore: async (id, scoreData) => {
        try {
            const response = await axios.put(`/AdmissionScores/${id}`, { ...scoreData, id })
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteAdmissionScore: async (id) => {
        try {
            await axios.delete(`/AdmissionScores/${id}`)
            return true
        } catch (error) {
            throw error
        }
    },

    checkAdmissionScoreExists: async (id) => {
        try {
            const response = await axios.get(`/AdmissionScores/exists/${id}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    searchAdmissionScores: async (query, filters = {}) => {
        try {
            const admissionScores = await admissionScoreService.getAllAdmissionScores()

            let filtered = [...admissionScores]

            if (query) {
                filtered = filtered.filter(admissionScore =>
                    admissionScore.name.toLowerCase().includes(query.toLowerCase()) ||
                    admissionScore.description.toLowerCase().includes(query.toLowerCase())
                )
            }

            if (filters.major && filters.major !== 'clear') {
                filtered = filtered.filter(admissionScore => admissionScore.majorId === filters.major)
            }

            if (filters.year && filters.year !== 'clear') {
                filtered = filtered.filter(admissionScore => admissionScore.year === filters.year)
            }

            return filtered
        } catch (error) {
            throw error
        }
    }
}

export default admissionScoreService