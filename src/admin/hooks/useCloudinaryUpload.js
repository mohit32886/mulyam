import { useState, useCallback } from 'react'

// Cloudinary configuration
const CLOUD_NAME = 'daieejy7c'
const UPLOAD_PRESET = 'mulyam_admin' // Unsigned upload preset

/**
 * Hook for uploading images to Cloudinary
 *
 * To set up the upload preset in Cloudinary:
 * 1. Go to Settings > Upload > Upload presets
 * 2. Click "Add upload preset"
 * 3. Name: "mulyam_admin"
 * 4. Signing mode: "Unsigned"
 * 5. Folder: "mulyam/products"
 * 6. Save
 */
export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})
  const [errors, setErrors] = useState({})

  /**
   * Upload a single file to Cloudinary
   */
  const uploadFile = useCallback(async (file, options = {}) => {
    const { folder = 'mulyam/products', onProgress } = options
    const fileId = `${file.name}-${Date.now()}`

    try {
      setProgress(prev => ({ ...prev, [fileId]: 0 }))
      setErrors(prev => {
        const next = { ...prev }
        delete next[fileId]
        return next
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      formData.append('folder', folder)

      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setProgress(prev => ({ ...prev, [fileId]: percentComplete }))
            onProgress?.(percentComplete)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            setProgress(prev => {
              const next = { ...prev }
              delete next[fileId]
              return next
            })
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              width: response.width,
              height: response.height,
              format: response.format,
            })
          } else {
            const error = new Error(`Upload failed: ${xhr.statusText}`)
            setErrors(prev => ({ ...prev, [fileId]: error.message }))
            reject(error)
          }
        })

        xhr.addEventListener('error', () => {
          const error = new Error('Network error during upload')
          setErrors(prev => ({ ...prev, [fileId]: error.message }))
          reject(error)
        })

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
        xhr.send(formData)
      })
    } catch (error) {
      setErrors(prev => ({ ...prev, [fileId]: error.message }))
      throw error
    }
  }, [])

  /**
   * Upload multiple files to Cloudinary
   */
  const uploadFiles = useCallback(async (files, options = {}) => {
    setUploading(true)
    const results = []
    const errors = []

    for (const file of files) {
      try {
        const result = await uploadFile(file, options)
        results.push(result)
      } catch (error) {
        errors.push({ file: file.name, error: error.message })
      }
    }

    setUploading(false)
    return { results, errors }
  }, [uploadFile])

  /**
   * Clear all progress and errors
   */
  const reset = useCallback(() => {
    setProgress({})
    setErrors({})
  }, [])

  return {
    uploadFile,
    uploadFiles,
    uploading,
    progress,
    errors,
    reset,
  }
}

export default useCloudinaryUpload
