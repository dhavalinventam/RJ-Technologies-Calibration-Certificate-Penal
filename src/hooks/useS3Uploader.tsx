import { useState } from 'react'
import axios from 'axios'
import apiClient from '@/lib/axios'

export const useS3Uploader = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getS3Post = async (endpoint: string, type: string, bodyData?: any) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiClient.post(`${endpoint}`, bodyData)
      return response?.data?.data
    } catch (error) {
      throw error
    }
  }

  const uploadToS3 = async (presignedPostUrl: any, formData: any) => {
    setIsLoading(true)
    try {
      const response = await axios.post(presignedPostUrl.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          acl: 'public-read'
        }
      })
      return response.status ? presignedPostUrl?.fields?.key : ''
    } catch {
      return ''
    }
  }

  const uploadFileToS3 = async (file: File, endpoint: string, extraData?: any) => {
    const { type } = file
    try {
      const presignedPostUrl = await getS3Post(endpoint, type, extraData)
      const formData = new FormData()
      Object.entries(presignedPostUrl.fields).forEach(([k, v]: any) => {
        formData.append(k, v)
      })
      formData.append('file', file)
      if (presignedPostUrl.url) {
        const url = await uploadToS3(presignedPostUrl, formData)
        return url
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
    return null
  }

  const removeUploadedFileFromS3 = async (fileKey: string) => {
    if (!fileKey) return null
    try {
      const response = await apiClient.post(`/s3/remove-files-from-s3`, {
        removable_keys: [{ key: fileKey }]
      })
      return response
    } catch (err) {
      console.error('Error removing file:', err)
      return null
    }
  }

  const getFileTypeFromS3 = async (url: string): Promise<'image' | 'video' | 'unknown'> => {
    try {
      const response = await fetch(url, { mode: 'cors' })
      const contentType = response.headers.get('content-type')
      if (contentType?.startsWith('image')) return 'image'
      if (contentType?.startsWith('video')) return 'video'
      return 'unknown'
    } catch (error) {
      console.error('Error fetching file type:', error)
      return 'unknown'
    }
  }

  return {
    uploadFileToS3,
    removeUploadedFileFromS3,
    getFileTypeFromS3,
    isLoading
  }
}
