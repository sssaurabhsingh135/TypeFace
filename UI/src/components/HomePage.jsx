import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, File, FileText, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

const SUPPORTED_FILE_TYPES = {
  'application/pdf': { icon: FileText, color: '#D0021B' },
  'application/msword': { icon: FileText, color: '#2B579A' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: '#2B579A' },
  'application/vnd.ms-excel': { icon: FileText, color: '#217346' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileText, color: '#217346' }
}

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx']

function HomePage({ files, onAddFile, onDeleteFile, loading, error, onRefresh }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  const isFileSupported = (file) => {
    const extension = file.name.split('.').pop().toLowerCase()
    return ALLOWED_EXTENSIONS.includes(extension) || SUPPORTED_FILE_TYPES[file.type]
  }

  const handleFileUpload = async (selectedFiles) => {
    setUploadError('')
    const fileArray = Array.from(selectedFiles)

    for (const file of fileArray) {
      if (!isFileSupported(file)) {
        setUploadError(`File "${file.name}" is not supported. Allowed types: PDF, Word (doc, docx), Excel (xls, xlsx)`)
        continue
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError(`File "${file.name}" is too large. Maximum size is 10MB.`)
        continue
      }

      try {
        setUploading(true)
        await onAddFile(file)
      } catch (err) {
        setUploadError(`${err.message ? err.message : ''} Failed to upload "${file.name}". Please try again.`)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (file) => {
    const fileType = SUPPORTED_FILE_TYPES[file.type]
    if (fileType) {
      const IconComponent = fileType.icon
      return <IconComponent size={24} color={fileType.color} />
    }
    return <File size={24} color="#666" />
  }

  return (
    <div className="home-page">
      <header className="header">
        <h1>File Manager</h1>
        <p>Upload and manage your files with ease</p>
      </header>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={onRefresh} className="refresh-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      <div className="upload-section">
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload size={48} />
          <h3>{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</h3>
          <p>Supported formats: PDF, Word (doc, docx), Excel (xls, xlsx)</p>
          <input
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="file-input"
            disabled={uploading}
          />
        </div>

        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}
      </div>

      <div className="files-section">
        <h2>Your Files ({files.length})</h2>

        {loading ? (
          <div className="loading-state">
            <RefreshCw size={48} className="spinning" />
            <p>Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <File size={64} color="#ccc" />
            <p>No files uploaded yet</p>
            <p>Upload your first file to get started</p>
          </div>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file._id} className="file-card">
                <div className="file-icon">
                  {getFileIcon(file)}
                </div>
                
                <div className="file-info">
                  <h3 className="file-name">{file.filename}</h3>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                  <p className="file-date">{formatDate(file.uploadDate)}</p>
                </div>
                
                <div className="file-actions">
                  <Link to={`/file/${file._id}`} className="view-button">
                    View
                  </Link>
                  <button 
                    onClick={() => onDeleteFile(file._id)}
                    className="delete-button"
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
