import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import FileViewer from './components/FileViewer'
import fileApiService from './services/fileApi'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load files from API on app start
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const filesData = await fileApiService.getFiles()
      setFiles(filesData)
    } catch (err) {
      setError('Failed to load files. Please try again.')
      console.error('Error loading files:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFile = async (file) => {
    try {
      setError(null)
      const uploadedFile = await fileApiService.saveFile(file)
      setFiles(prev => [...prev, uploadedFile])
      return uploadedFile
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error('Error uploading file:', err)
      throw err
    }
  }

  const deleteFile = async (fileId) => {
    try {
      setError(null)
      await fileApiService.deleteFile(fileId)
      setFiles(prev => prev.filter(file => file._id !== fileId))
    } catch (err) {
      setError('Failed to delete file. Please try again.')
      console.error('Error deleting file:', err)
      throw err
    }
  }

  const downloadFile = async (fileId, fileName) => {
    try {
      setError(null)
      await fileApiService.downloadFile(fileId, fileName)
    } catch (err) {
      setError('Failed to download file. Please try again.')
      console.error('Error downloading file:', err)
      throw err
    }
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              files={files}
              onAddFile={addFile}
              onDeleteFile={deleteFile}
              loading={loading}
              error={error}
              onRefresh={loadFiles}
            />
          }
        />
        <Route
          path="/file/:fileId"
          element={
            <FileViewer
              files={files}
              onDownload={downloadFile}
              apiService={fileApiService}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
