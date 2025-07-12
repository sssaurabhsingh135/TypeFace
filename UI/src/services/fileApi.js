// API base URL - update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

// API service for file operations
class FileApiService {
  
  // Get all files
  async getFiles() {
    try {
      const response = await fetch(`${API_BASE_URL}/getFiles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching files:', error)
      throw error
    }
  }

  // Upload/Save a new file
  async saveFile(file) {
    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('uploadDate', new Date().toISOString())
      
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Delete a file
  async deleteFile(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }



  // Download a file
  async downloadFile(fileId, fileName) {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${fileId}`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }
      
      // Get the blob data
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Error downloading file:', error)
      throw error
    }
  }

}

// Create and export a singleton instance
const fileApiService = new FileApiService()
export default fileApiService
