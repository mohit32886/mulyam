import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Pencil } from 'lucide-react'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'
import ImageEditModal from './ImageEditModal'

/**
 * Drag and drop image upload zone component
 */
export default function ImageUploadZone({ onUpload, folder, disabled = false, enableEditing = true }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [editingFile, setEditingFile] = useState(null) // File being edited
  const fileInputRef = useRef(null)
  const inputId = useRef(`file-upload-${Math.random().toString(36).slice(2, 9)}`).current
  const { uploadFile } = useCloudinaryUpload()

  // Cleanup preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadingFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [uploadingFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(async (files) => {
    if (disabled) return

    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length === 0) return

    // Add files to state with pending status (if editing enabled) or upload directly
    const newUploadingFiles = imageFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
      editedBlob: null,
      progress: 0,
      status: enableEditing ? 'pending' : 'uploading',
    }))

    setUploadingFiles(prev => [...prev, ...newUploadingFiles])

    // If editing is disabled, upload immediately
    if (!enableEditing) {
      for (const uploadingFile of newUploadingFiles) {
        await uploadSingleFile(uploadingFile)
      }
    }
  }, [disabled, enableEditing])

  // Upload a single file (original or edited)
  const uploadSingleFile = useCallback(async (uploadingFile) => {
    const fileToUpload = uploadingFile.editedBlob || uploadingFile.file

    // Update status to uploading
    setUploadingFiles(prev =>
      prev.map(f =>
        f.id === uploadingFile.id ? { ...f, status: 'uploading' } : f
      )
    )

    try {
      const result = await uploadFile(fileToUpload, {
        folder,
        onProgress: (progress) => {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadingFile.id ? { ...f, progress } : f
            )
          )
        },
      })

      // Remove from list and call onUpload
      setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id))
      URL.revokeObjectURL(uploadingFile.preview)
      onUpload?.(result.url)
    } catch (error) {
      // Mark as error
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      )
    }
  }, [folder, uploadFile, onUpload])

  // Handle edit button click
  const handleEditClick = useCallback((file) => {
    setEditingFile(file)
  }, [])

  // Handle save from edit modal
  const handleEditSave = useCallback((blob) => {
    if (!editingFile) return

    // Create a new preview URL for the edited blob
    const editedPreview = URL.createObjectURL(blob)

    // Update the file with edited blob
    setUploadingFiles(prev =>
      prev.map(f =>
        f.id === editingFile.id
          ? {
              ...f,
              editedBlob: blob,
              preview: editedPreview,
            }
          : f
      )
    )

    // Revoke old preview URL
    URL.revokeObjectURL(editingFile.preview)

    setEditingFile(null)
  }, [editingFile])

  // Handle upload button click (for pending files)
  const handleUploadClick = useCallback(async (file) => {
    await uploadSingleFile(file)
  }, [uploadSingleFile])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (files) {
      processFiles(files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files
    if (files) {
      processFiles(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  const removeUploadingFile = useCallback((id) => {
    setUploadingFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="sr-only"
        disabled={disabled}
      />

      {/* Drop Zone - uses label to trigger file input */}
      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          block p-6 border-2 border-dashed rounded-lg cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-admin-border hover:border-neutral-500 hover:bg-admin-card-hover'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className={`
            p-3 rounded-full
            ${isDragging ? 'bg-orange-500/20' : 'bg-admin-card-hover'}
          `}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-orange-500' : 'text-neutral-500'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-300">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-neutral-600">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      </label>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 bg-admin-card rounded-lg"
            >
              {/* Preview */}
              <div className="w-12 h-12 rounded overflow-hidden bg-admin-card-hover flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Info & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-neutral-300 truncate">{file.name}</p>
                  {file.status === 'pending' && (
                    <span className="text-xs text-yellow-500">Ready to upload</span>
                  )}
                  {file.editedBlob && (
                    <span className="text-xs text-green-500">Edited</span>
                  )}
                </div>
                {file.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{file.progress}%</p>
                  </div>
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1">{file.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {file.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleEditClick(file)}
                      className="p-1.5 text-neutral-400 hover:text-orange-400 hover:bg-orange-500/10 rounded"
                      title="Edit image"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUploadClick(file)}
                      className="p-1.5 text-neutral-400 hover:text-green-400 hover:bg-green-500/10 rounded"
                      title="Upload"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </>
                )}
                {file.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                )}
                {(file.status === 'pending' || file.status === 'error') && (
                  <button
                    onClick={() => removeUploadingFile(file.id)}
                    className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Edit Modal */}
      <ImageEditModal
        isOpen={!!editingFile}
        imageUrl={editingFile?.preview}
        onClose={() => setEditingFile(null)}
        onSave={handleEditSave}
      />
    </div>
  )
}
