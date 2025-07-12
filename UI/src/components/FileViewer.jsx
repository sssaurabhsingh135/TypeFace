import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, File } from 'lucide-react'

function FileViewer({ files, onDownload, apiService }) {
  const { fileId } = useParams()
  
  const file = files.find(f => f._id === fileId)
  
  if (!file) {
    return (
      <div className="file-viewer">
        <div className="viewer-header">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
            Back to Files
          </Link>
        </div>
        <div className="error-state">
          <File size={64} color="#ccc" />
          <h2>File not found</h2>
          <p>The file you're looking for doesn't exist or has been deleted.</p>
          <Link to="/" className="home-link">Go back to home</Link>
        </div>
      </div>
    )
  }

  const downloadFile = async () => {
    try {
      if (onDownload) {
        // Use the API service through the parent component
        await onDownload(file._id, file.filename)
      } else {
        // Fallback to direct API call
        await apiService.downloadFile(file._id, file.name)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download file. Please try again.')
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileTypeInfo = () => {
    if (file.type === 'application/pdf' || file.filename.endsWith('.pdf')) {
      return { name: 'PDF Document', color: '#D0021B', description: 'Portable Document Format' }
    }
    if (file.type === 'application/msword' || file.filename.endsWith('.doc')) {
      return { name: 'Word Document', color: '#2B579A', description: 'Microsoft Word Document (Legacy)' }
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.filename.endsWith('.docx')) {
      return { name: 'Word Document', color: '#2B579A', description: 'Microsoft Word Document' }
    }
    if (file.type === 'application/vnd.ms-excel' || file.filename.endsWith('.xls')) {
      return { name: 'Excel Spreadsheet', color: '#217346', description: 'Microsoft Excel Spreadsheet (Legacy)' }
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.filename.endsWith('.xlsx')) {
      return { name: 'Excel Spreadsheet', color: '#217346', description: 'Microsoft Excel Spreadsheet' }
    }
    return { name: 'Document', color: '#666', description: 'Unknown document type' }
  }

  const renderFileContent = () => {
    const fileInfo = getFileTypeInfo()

    return (
      <div className="document-viewer">
        <div className="document-info">
          <div className="document-icon" style={{ color: fileInfo.color }}>
            <File size={80} />
          </div>
          <div className="document-details">
            <h2>{fileInfo.name}</h2>
            <p className="document-type">{fileInfo.description}</p>
            <div className="document-stats">
              <div className="stat">
                <span className="stat-label">File Size:</span>
                <span className="stat-value">{formatFileSize(file.size)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Uploaded:</span>
                <span className="stat-value">{formatDate(file.uploadDate)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">File Name:</span>
                <span className="stat-value">{file.filename}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="document-actions">
          <button onClick={downloadFile} className="download-button primary">
            <Download size={20} />
            Download File
          </button>
          <p className="download-note">
            Download the file to view its contents in the appropriate application.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="file-viewer">
      <div className="viewer-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Files
        </Link>
        
        <div className="file-details">
          <h1 className="file-title">{file.name}</h1>
          <div className="file-meta">
            <span className="file-size">{formatFileSize(file.size)}</span>
            <span className="file-date">Uploaded {formatDate(file.uploadDate)}</span>
          </div>
        </div>
        
        <button onClick={downloadFile} className="download-btn">
          <Download size={16} />
          Download
        </button>
      </div>
      
      <div className="viewer-content">
        {renderFileContent()}
      </div>
    </div>
  )
}

export default FileViewer
