import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react'
import { AdminButton, AdminInput, AdminSelect, AdminToggle } from '../ui'
import { DEFAULTS, COLORS } from '../../../constants/brand'
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload'

function BannerItemModal({ isOpen, onClose, onSave, banner = null }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    linkText: '',
    position: 'hero',
    backgroundColor: DEFAULTS.bannerBackgroundColor,
    textColor: COLORS.white,
    image: '',
    isActive: true,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { uploadFile } = useCloudinaryUpload()

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        linkUrl: banner.linkUrl || '',
        linkText: banner.linkText || 'Shop Now',
        position: banner.position || 'hero',
        backgroundColor: banner.backgroundColor || DEFAULTS.bannerBackgroundColor,
        textColor: banner.textColor || COLORS.white,
        image: banner.image || '',
        isActive: banner.isActive !== false,
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        linkUrl: '',
        linkText: 'Shop Now',
        position: 'hero',
        backgroundColor: DEFAULTS.bannerBackgroundColor,
        textColor: COLORS.white,
        image: '',
        isActive: true,
      })
    }
  }, [banner, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadFile(file, {
        folder: 'banners',
        onProgress: (progress) => setUploadProgress(progress),
      })
      handleChange('image', result.url)
    } catch (error) {
      console.error('Failed to upload banner image:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = () => {
    handleChange('image', '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: banner?.id || Date.now().toString(),
    })
  }

  if (!isOpen) return null

  const isEditing = !!banner

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
        <div className="bg-admin-card border border-admin-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border sticky top-0 bg-admin-card">
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Banner' : 'New Banner'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Banner Title *
              </label>
              <AdminInput
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Summer Sale"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Subtitle
              </label>
              <AdminInput
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="e.g., Up to 50% off on selected items"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Link URL
                </label>
                <AdminInput
                  value={formData.linkUrl}
                  onChange={(e) => handleChange('linkUrl', e.target.value)}
                  placeholder="/collections/sale"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Link Text
                </label>
                <AdminInput
                  value={formData.linkText}
                  onChange={(e) => handleChange('linkText', e.target.value)}
                  placeholder="Shop Now"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Position
              </label>
              <AdminSelect
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                options={[
                  { value: 'hero', label: 'Hero (Homepage)' },
                  { value: 'announcement', label: 'Announcement Bar' },
                  { value: 'collection', label: 'Collection Page' },
                  { value: 'sidebar', label: 'Sidebar' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded border border-admin-border cursor-pointer"
                  />
                  <AdminInput
                    value={formData.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    placeholder={DEFAULTS.bannerBackgroundColor}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-10 h-10 rounded border border-admin-border cursor-pointer"
                  />
                  <AdminInput
                    value={formData.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Banner Image
              </label>
              {formData.image ? (
                <div className="relative group">
                  <img
                    src={formData.image}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded-lg border border-admin-border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <label className="p-2 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer">
                      <Upload className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-white/20 hover:bg-red-500/50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading ? 'border-orange-500 bg-orange-500/10' : 'border-admin-border hover:border-neutral-500 hover:bg-admin-card-hover'}`}>
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      <span className="text-sm text-neutral-400">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-neutral-500 mb-2" />
                      <span className="text-sm text-neutral-400">Click to upload image</span>
                      <span className="text-xs text-neutral-600">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={isUploading}
                  />
                </label>
              )}
              <p className="text-xs text-neutral-600 mt-1">
                Optional: Add a background image for the banner
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg">
              <div>
                <p className="text-white">Active</p>
                <p className="text-sm text-neutral-500">Banner is visible on the site</p>
              </div>
              <AdminToggle
                checked={formData.isActive}
                onChange={(checked) => handleChange('isActive', checked)}
              />
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">Preview</p>
              <div
                className="p-6 rounded-lg text-center"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor,
                  backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {formData.image && (
                  <div className="absolute inset-0 bg-black/30 rounded-lg" />
                )}
                <div className="relative">
                  <h3 className="text-lg font-semibold">
                    {formData.title || 'Banner Title'}
                  </h3>
                  {formData.subtitle && (
                    <p className="text-sm opacity-90 mt-1">{formData.subtitle}</p>
                  )}
                  {formData.linkText && (
                    <button
                      type="button"
                      className="mt-3 px-4 py-1.5 text-sm rounded"
                      style={{
                        backgroundColor: formData.textColor,
                        color: formData.backgroundColor,
                      }}
                    >
                      {formData.linkText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-admin-border sticky bottom-0 bg-admin-card">
            <AdminButton variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Create Banner'}
            </AdminButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default BannerItemModal
