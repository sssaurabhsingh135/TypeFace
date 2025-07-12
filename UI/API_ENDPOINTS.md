

This document describes the API endpoints that the React file manager application expects from your backend server.

## Base URL
Set the `REACT_APP_API_URL` environment variable to your backend URL (default: `http://127.0.0.1:5000`)

## Endpoints

### 1. Get All Files
**GET** `/getFiles`

**Response:**
```json
[
  {
    "_id": "unique-file-id",
    "filename": "document.pdf",
    "type": "application/pdf",
    "size": 1024000,
    "uploadDate": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Upload File
**POST** `/files/upload`

**Request:** FormData with:
- `files`: The file to upload
- `uploadDate`: ISO string of upload date

**Response:**
```json
{
  "_id": "unique-file-id",
  "filename": "document.pdf",
  "type": "application/pdf",
  "size": 1024000,
  "uploadDate": "2024-01-15T10:30:00.000Z"
}
```

### 3. Delete File
**DELETE** `/files/:fileId`

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```



### 4. Download File
**GET** `/download/:fileId`

**Response:** Binary file data with appropriate headers:
- `Content-Type`: The file's MIME type
- `Content-Disposition`: `attachment; filename="filename.ext"`



## Supported File Types

The application is configured to only accept:
- PDF files (.pdf)
- Word documents (.doc, .docx)
- Excel spreadsheets (.xls, .xlsx)

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid file type, file too large, etc.)
- 404: File not found
- 500: Internal server error

Error responses should include:
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## File Size Limits

The frontend enforces a 10MB file size limit. Your backend should also validate file sizes and types for security.





