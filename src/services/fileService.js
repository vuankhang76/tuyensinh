import axios from '../api/axios'

export const fileService = {
  uploadLogo: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/File/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteLogo: async (fileName) => {
    try {
      const response = await axios.delete(`/File/delete-logo/${fileName}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default fileService 