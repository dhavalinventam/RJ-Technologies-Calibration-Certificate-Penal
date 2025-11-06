import imageCompression from 'browser-image-compression'

export const MAX_ALLOWED_SIZE_MB = 10
export const COMPRESSION_TRIGGER_SIZE_MB = 5

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  wasCompressed: boolean
  compressionRatio: number
}

/**
 * Compresses an image file if it exceeds the compression trigger size
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise<CompressionResult> - The compression result with metadata
 */
export async function compressImageIfNeeded(file: File, options: CompressionOptions = {}): Promise<CompressionResult> {
  const { maxSizeMB = 5, maxWidthOrHeight = 1920, useWebWorker = true, fileType = 'image/jpeg' } = options

  const originalSize = file.size
  const originalSizeMB = originalSize / (1024 * 1024)

  // Check if file exceeds maximum allowed size
  if (originalSizeMB > MAX_ALLOWED_SIZE_MB) {
    throw new Error(
      `File size (${originalSizeMB.toFixed(2)}MB) exceeds maximum allowed size of ${MAX_ALLOWED_SIZE_MB}MB`
    )
  }

  // If file is smaller than compression trigger, return original file
  if (originalSizeMB <= COMPRESSION_TRIGGER_SIZE_MB) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
      compressionRatio: 1
    }
  }

  try {
    const compressionOptions = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      fileType
    }

    const compressedFile = await imageCompression(file, compressionOptions)
    const compressedSize = compressedFile.size
    const compressedSizeMB = compressedSize / (1024 * 1024)

    // Check if compressed file still exceeds maximum allowed size
    if (compressedSizeMB > MAX_ALLOWED_SIZE_MB) {
      throw new Error(
        `Compressed file size (${compressedSizeMB.toFixed(2)}MB) still exceeds maximum allowed size of ${MAX_ALLOWED_SIZE_MB}MB`
      )
    }

    const compressionRatio = compressedSize / originalSize

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      wasCompressed: true,
      compressionRatio
    }
  } catch (error) {
    console.error('Image compression error:', error)
    throw new Error(`Failed to compress image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Checks if a file is an image
 * @param file - The file to check
 * @returns boolean - True if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}
