import { useState, useRef, useCallback, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Loader2, Check } from 'lucide-react'
import { AdminButton } from './index'
import { useImageEditor } from '../../hooks/useImageEditor'

/**
 * Modal for editing images before upload
 * Supports crop, rotate, and flip operations
 */
export default function ImageEditModal({ isOpen, imageUrl, onClose, onSave }) {
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const imgRef = useRef(null)
  const { generateEditedImage, isProcessing } = useImageEditor()

  // Reset state when modal opens with new image
  useEffect(() => {
    if (isOpen) {
      setCrop(undefined)
      setCompletedCrop(null)
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
    }
  }, [isOpen, imageUrl])

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => (prev - 90 + 360) % 360)
  }, [])

  const handleFlipHorizontal = useCallback(() => {
    setFlipH((prev) => !prev)
  }, [])

  const handleFlipVertical = useCallback(() => {
    setFlipV((prev) => !prev)
  }, [])

  const handleApply = useCallback(async () => {
    if (!imgRef.current) return

    setIsSaving(true)
    try {
      // Convert completed crop percentages to pixels if available
      let pixelCrop = null
      if (completedCrop && completedCrop.width && completedCrop.height) {
        const img = imgRef.current
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height

        pixelCrop = {
          x: completedCrop.x * scaleX,
          y: completedCrop.y * scaleY,
          width: completedCrop.width * scaleX,
          height: completedCrop.height * scaleY,
        }
      }

      const blob = await generateEditedImage(imgRef.current, {
        crop: pixelCrop,
        rotation,
        flipH,
        flipV,
      })

      onSave(blob)
    } catch (error) {
      console.error('Failed to process image:', error)
    } finally {
      setIsSaving(false)
    }
  }, [completedCrop, rotation, flipH, flipV, generateEditedImage, onSave])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-admin-bg border border-admin-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-admin-border">
            <h2 className="text-lg font-semibold text-white">Edit Image</h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-admin-card-hover rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="flex-1 overflow-auto p-4 bg-neutral-900 flex items-center justify-center">
            <div
              className="relative"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Edit preview"
                  className="max-h-[50vh] max-w-full object-contain"
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-admin-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* Rotate Controls */}
              <button
                onClick={handleRotateLeft}
                className="p-3 bg-admin-card-hover text-neutral-300 hover:text-white rounded-lg transition-colors"
                title="Rotate Left"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleRotateRight}
                className="p-3 bg-admin-card-hover text-neutral-300 hover:text-white rounded-lg transition-colors"
                title="Rotate Right"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              <div className="w-px h-8 bg-admin-border mx-2" />

              {/* Flip Controls */}
              <button
                onClick={handleFlipHorizontal}
                className={`p-3 rounded-lg transition-colors ${
                  flipH
                    ? 'bg-orange-500 text-white'
                    : 'bg-admin-card-hover text-neutral-300 hover:text-white'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={handleFlipVertical}
                className={`p-3 rounded-lg transition-colors ${
                  flipV
                    ? 'bg-orange-500 text-white'
                    : 'bg-admin-card-hover text-neutral-300 hover:text-white'
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center mb-4">
              Click and drag on the image to crop. Use buttons to rotate or flip.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2">
              <AdminButton variant="secondary" onClick={onClose}>
                Cancel
              </AdminButton>
              <AdminButton onClick={handleApply} disabled={isSaving || isProcessing}>
                {isSaving || isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Apply Changes
                  </>
                )}
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
