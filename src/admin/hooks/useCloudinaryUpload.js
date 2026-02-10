import { useState, useCallback } from 'react'

// Cloudinary configuration from environment variables
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mulyam_admin'

if (!CLOUD_NAME) {
  console.warn(
    'Missing VITE_CLOUDINARY_CLOUD_NAME environment variable. Image uploads will fail.'
  )
}

/**
 * Hook for uploading images to Cloudinary
 *
 * SECURITY NOTE: This uses unsigned uploads for simplicity.
 * For production, consider implementing signed uploads:
 *
 * 1. Create a Supabase Edge Function or backend endpoint that generates signatures:
 *    ```js
 *    import { v2 as cloudinary } from 'cloudinary'
 *    cloudinary.config({
 *      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 *      api_key: process.env.CLOUDINARY_API_KEY,
 *      api_secret: process.env.CLOUDINARY_API_SECRET, // NEVER expose in frontend!
 *    })
 *    const signature = cloudinary.utils.api_sign_request(params, api_secret)
 *    ```
 *
 * 2. Call your backend to get the signature before uploading
 *
 * For unsigned uploads, configure the preset securely in Cloudinary:
 * 1. Go to Settings > Upload > Upload presets
 * 2. Click "Add upload preset"
 * 3. Name: "mulyam_admin"
 * 4. Signing mode: "Unsigned"
 * 5. Folder: "mulyam/products" (restrict to specific folder)
 * 6. Allowed formats: jpg, png, webp (restrict file types)
 * 7. Max file size: 5MB (prevent abuse)
 * 8. Access mode: authenticated (optional, for private images)
 * 9. Save
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
