import path from 'path'

/**
 * File storage configuration
 */
export const storageConfig = {
  // Base upload directory
  uploadDir: process.env.UPLOAD_DIR || 'public/uploads',
  
  // Maximum file size (in bytes)
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  
  // Allowed file types
  allowedMimeTypes: {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  
  // Subdirectories for different upload types
  directories: {
    gemstones: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'gemstones'),
    roughStones: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'rough-stones'),
    jewelry: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'jewelry'),
    documents: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'documents'),
    users: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'users'),
    temp: path.join(process.env.UPLOAD_DIR || 'public/uploads', 'temp'),
  },
  
  // Image processing options
  image: {
    resize: {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 },
    },
    quality: 85, // JPEG quality
    formats: ['webp', 'jpeg'], // Output formats
  },
}