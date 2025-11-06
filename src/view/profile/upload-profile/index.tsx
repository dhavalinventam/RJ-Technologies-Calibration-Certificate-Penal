import { useCallback, useEffect, useState } from 'react'
import { UserIcon } from '@/assets/png'
import { Icon } from '@iconify/react'
import { useDropzone } from 'react-dropzone'
import { useAppDispatch } from '@/redux/redux-hooks'
import { getProfileImage, setProfileImage, uploadProfileImage } from '@/redux/slices/userSlice'
import { useS3Uploader } from '@/hooks/useS3Uploader'
import { showToastError } from '@/utils/helper'
import { MESSAGE } from '@/utils/errorMessages'
import { getNameInitials, getColorFromString } from '@/utils/common'
import { compressImageIfNeeded, formatFileSize, isImageFile } from '@/utils/imageCompression'
import './index.scss'

interface IProps {
  id: string
  isAdmin?: boolean
}

const UploadProfile = ({ id, isAdmin = false }: IProps) => {
  const dispatch = useAppDispatch()
  const [uploadedImage, setUploadedImage] = useState<string>(UserIcon)

  const { uploadFileToS3, isLoading } = useS3Uploader()

  const users = localStorage.getItem('user')
  const user = users ? JSON.parse(users || '{}') : ''
  const currentUserId = user?.user_id

  // Get user name for initials
  const getUserName = () => {
    const userInfo = localStorage.getItem('user')
    if (userInfo) {
      const userData = JSON.parse(userInfo)
      return `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    }
    return ''
  }

  const userName = getUserName()
  const userInitials = getNameInitials(userName)
  const initialsColor = getColorFromString(userName)

  useEffect(() => {
    if (!id) {
      return
    }
    handle.getProfileImage()
  }, [id])

  const handle = {
    getProfileImage: () => {
      dispatch(getProfileImage({ id }))
        .unwrap()
        .then(res => {
          const newImageUrl = res?.data?.profile_image_url
          if (newImageUrl) setUploadedImage(newImageUrl)
          if (id === currentUserId) {
            dispatch(setProfileImage(newImageUrl))
          }
        })
    },
    uploadProfileImage: (fileKey: string) => {
      dispatch(uploadProfileImage({ id, upload_key: fileKey }))
        .unwrap()
        .then(() => {
          handle.getProfileImage()
        })
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      if (!file) return

      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        showToastError(MESSAGE.INVALID_IMAGE_FILE)
        return
      }

      // Handle image compression if needed
      let uploadFile = file
      let compressionInfo = ''

      // Check file size after compression
      if (uploadFile.size > 10 * 1024 * 1024) {
        showToastError(MESSAGE.FILE_SIZE_SHOULD_BE_LESS_THAN_10MB)
        return
      }

      if (isImageFile(file)) {
        try {
          const compressionResult = await compressImageIfNeeded(file)
          uploadFile = compressionResult.file

          if (compressionResult.wasCompressed) {
            const originalSize = formatFileSize(compressionResult.originalSize)
            const compressedSize = formatFileSize(compressionResult.compressedSize)
            const compressionPercent = ((1 - compressionResult.compressionRatio) * 100).toFixed(1)
            compressionInfo = `Compressed from ${originalSize} to ${compressedSize} (${compressionPercent}% reduction)`
            console.log('Profile image compressed:', compressionInfo)
          }
        } catch (compressionError) {
          console.error('Compression error:', compressionError)
          showToastError(compressionError instanceof Error ? compressionError.message : 'Failed to compress image')
          return
        }
      }

      try {
        const fileExtension = uploadFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExtension}`

        const fileKey = await uploadFileToS3(uploadFile, `/user/${id}/pre-signed-url-profile-image`, {
          file_name: fileName
        })
        if (fileKey) {
          handle.uploadProfileImage(fileKey)

          // Show compression info if image was compressed
          if (compressionInfo) {
            console.log(compressionInfo)
          }
        } else {
          showToastError(MESSAGE.FAILED_TO_UPLOAD_IMAGE)
        }
      } catch (err) {
        showToastError(err instanceof Error ? err.message : MESSAGE.FAILED_TO_UPLOAD_IMAGE)
      }
    },
    [id, uploadFileToS3]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024
  })

  // Check if we should show initials (when image is default UserIcon or empty)
  const shouldShowInitials = !uploadedImage || uploadedImage === UserIcon || uploadedImage.includes('user-icon')

  return (
    <div className='user_image'>
      <div className='profile-upload-container'>
        {shouldShowInitials ? (
          <div className='initials-container' style={{ backgroundColor: initialsColor }}>
            <span className='initials-text'>{userInitials || 'U'}</span>
          </div>
        ) : (
          <img className='image' src={uploadedImage} alt='avatar' />
        )}
        {isAdmin && (
          <div {...getRootProps()} className={`upload-overlay ${isLoading ? 'loading' : ''}`}>
            <input {...getInputProps()} />
            <div className='upload-icon'>
              <Icon icon='mdi:camera' width='16' height='16' />
            </div>
            {isLoading && (
              <div className='loading-overlay'>
                <Icon icon='mdi:loading' width='24' height='24' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadProfile
