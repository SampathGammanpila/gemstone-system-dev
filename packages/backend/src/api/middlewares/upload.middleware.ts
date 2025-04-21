import multer from 'multer'
import path from 'path'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { ApiError } from './error.middleware'
import { storageConfig } from '@/config/storage'

// Ensure upload directories exist
Object.values(storageConfig.directories).forEach(directory => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
})

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Determine destination directory based on file type or request
    let uploadDir = storageConfig.directories.temp
    
    if (req.path.includes('/gemstones')) {
      uploadDir = storageConfig.directories.gemstones
    } else if (req.path.includes('/rough-stones')) {
      uploadDir = storageConfig.directories.roughStones
    } else if (req.path.includes('/jewelry')) {
      uploadDir = storageConfig.directories.jewelry
    } else if (req.path.includes('/documents')) {
      uploadDir = storageConfig.directories.documents
    } else if (req.path.includes('/users')) {
      uploadDir = storageConfig.directories.users
    }
    
    cb(null, uploadDir)
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate a unique filename with original extension
    const uniqueId = uuidv4()
    const fileExtension = path.extname(file.originalname).toLowerCase()
    const filename = `${uniqueId}${fileExtension}`
    
    cb(null, filename)
  }
})

// Configure file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type based on MIME type
  const isImage = storageConfig.allowedMimeTypes.image.includes(file.mimetype)
  const isDocument = storageConfig.allowedMimeTypes.document.includes(file.mimetype)
  
  if (isImage || isDocument) {
    cb(null, true)
  } else {
    cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`))
  }
}

// Create multer upload instances
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: storageConfig.maxFileSize, // Max file size in bytes
  }
})

// Single file upload middleware
export const uploadSingle = (fieldName: string) => upload.single(fieldName)

// Multiple files upload middleware
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount)

// Multiple fields with files upload middleware
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields)

// Middleware to handle upload errors
export const handleUploadErrors = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, `File too large. Maximum size is ${storageConfig.maxFileSize / (1024 * 1024)}MB`))
    }
    return next(new ApiError(400, `Upload error: ${err.message}`))
  }
  
  if (err instanceof ApiError) {
    return next(err)
  }
  
  next(err)
}