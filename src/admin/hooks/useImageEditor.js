import { useState, useCallback } from 'react'

/**
 * Hook for image editing operations (crop, rotate, flip)
 * Uses canvas API to transform images before upload
 */
export function useImageEditor() {
  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * Generate an edited image blob from the source image
   * @param {HTMLImageElement} imageElement - The source image element
   * @param {Object} options - Editing options
   * @param {Object} options.crop - Crop dimensions {x, y, width, height} in pixels
   * @param {number} options.rotation - Rotation in degrees (0, 90, 180, 270)
   * @param {boolean} options.flipH - Flip horizontally
   * @param {boolean} options.flipV - Flip vertically
   * @param {string} options.outputFormat - Output format (default: 'image/jpeg')
   * @param {number} options.quality - Output quality 0-1 (default: 0.92)
   * @returns {Promise<Blob>} - The edited image as a Blob
   */
  const generateEditedImage = useCallback(async (imageElement, options = {}) => {
    const {
      crop,
      rotation = 0,
      flipH = false,
      flipV = false,
      outputFormat = 'image/jpeg',
      quality = 0.92,
    } = options

    setIsProcessing(true)

    try {
      // Create canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Calculate dimensions based on crop or full image
      const sourceWidth = crop?.width || imageElement.naturalWidth
      const sourceHeight = crop?.height || imageElement.naturalHeight
      const sourceX = crop?.x || 0
      const sourceY = crop?.y || 0

      // Adjust canvas size for rotation
      const isOrthogonal = rotation === 90 || rotation === 270
      const canvasWidth = isOrthogonal ? sourceHeight : sourceWidth
      const canvasHeight = isOrthogonal ? sourceWidth : sourceHeight

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Move to center, apply transforms, move back
      ctx.translate(canvasWidth / 2, canvasHeight / 2)

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180)

      // Apply flips
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

      // Draw image (centered)
      ctx.drawImage(
        imageElement,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        -sourceWidth / 2,
        -sourceHeight / 2,
        sourceWidth,
        sourceHeight
      )

      // Convert to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to generate image'))
            }
          },
          outputFormat,
          quality
        )
      })
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * Load an image from a URL or File and return an HTMLImageElement
   * @param {string|File} source - Image URL or File object
   * @returns {Promise<HTMLImageElement>}
   */
  const loadImage = useCallback(async (source) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))

      if (source instanceof File) {
        img.src = URL.createObjectURL(source)
      } else {
        img.src = source
      }
    })
  }, [])

  return {
    generateEditedImage,
    loadImage,
    isProcessing,
  }
}

export default useImageEditor
