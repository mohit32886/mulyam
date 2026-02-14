import { useState, useMemo } from 'react'
import {
  Image,
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  X,
  FolderOpen,
  Filter,
  Loader2,
} from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminBadge, AdminSelect, useToast } from '../components/ui'
import ImageUploadZone from '../components/ui/ImageUploadZone'
import { useProducts, useProductMutations } from '../hooks'

const collections = ['all', 'diva', 'mini', 'paws', 'bond', 'uncategorized']

function ImagesPage() {
  const toast = useToast()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [selectedImages, setSelectedImages] = useState([])
  const [copiedUrl, setCopiedUrl] = useState(null)

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [uploadedUrls, setUploadedUrls] = useState([])

  // Fetch products from Supabase
  const { data: products, loading, error, refetch } = useProducts()
  const { updateProduct } = useProductMutations()

  // Extract all unique images from products
  const images = useMemo(() => {
    const imageMap = new Map()

    products.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((url, index) => {
          if (url && !imageMap.has(url)) {
            imageMap.set(url, {
              id: `img-${product.id}-${index}`,
              url,
              name: `${product.name} - Image ${index + 1}`,
              productId: product.id,
              productName: product.name,
              collection: product.collection || 'uncategorized',
              uploadedAt: product.created_at || new Date().toISOString(),
            })
          }
        })
      }
    })

    return Array.from(imageMap.values())
  }, [products])

  // Filter images (supports name, product name, and SKU search)
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const query = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery ||
                           img.name.toLowerCase().includes(query) ||
                           img.productName.toLowerCase().includes(query) ||
                           img.productId.toLowerCase().includes(query) // SKU search
      const matchesCollection = selectedCollection === 'all' || img.collection === selectedCollection
      return matchesSearch && matchesCollection
    })
  }, [images, searchQuery, selectedCollection])

  // Stats
  const stats = useMemo(() => {
    const byCollection = {}
    images.forEach(img => {
      byCollection[img.collection] = (byCollection[img.collection] || 0) + 1
    })
    return {
      total: images.length,
      byCollection,
    }
  }, [images])

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    toast.success('URL copied to clipboard')
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleSelectImage = (imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map(img => img.id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return
    toast.info(`Delete functionality would remove ${selectedImages.length} images`)
    setSelectedImages([])
  }

  // Handle image upload to a product
  const handleImageUpload = (url) => {
    setUploadedUrls(prev => [...prev, url])
    toast.success('Image uploaded successfully')
  }

  // Save uploaded images to selected product
  const handleSaveUploadedImages = async () => {
    if (!selectedProductId || uploadedUrls.length === 0) {
      toast.error('Please select a product and upload at least one image')
      return
    }

    const product = products.find(p => p.id === selectedProductId)
    if (!product) {
      toast.error('Product not found')
      return
    }

    const existingImages = product.images || []
    const newImages = [...existingImages, ...uploadedUrls]

    const { error } = await updateProduct(selectedProductId, { images: newImages })

    if (error) {
      toast.error('Failed to save images to product')
    } else {
      toast.success(`${uploadedUrls.length} image(s) added to ${product.name}`)
      setIsUploadModalOpen(false)
      setSelectedProductId('')
      setUploadedUrls([])
      refetch()
    }
  }

  // Close upload modal
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false)
    setSelectedProductId('')
    setUploadedUrls([])
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Error banner if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Images</h1>
            <p className="text-neutral-400 mt-1">
              Manage product images and media assets
            </p>
          </div>
          <AdminButton onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4" />
            Upload Images
          </AdminButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <AdminCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-neutral-500">Total Images</p>
              </div>
            </div>
          </AdminCard>
          {['diva', 'mini', 'paws', 'bond'].map(collection => (
            <AdminCard key={collection} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-admin-card-hover rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.byCollection[collection] || 0}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase">{collection}</p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {/* Filters & Actions */}
        <AdminCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name, product or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 text-sm"
              />
            </div>

            {/* Collection Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                {collections.map(c => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Collections' : c.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-admin-card-hover rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-admin-border text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-admin-border text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-admin-border">
              <span className="text-sm text-neutral-400">
                {selectedImages.length} selected
              </span>
              <AdminButton variant="secondary" size="sm" onClick={handleSelectAll}>
                {selectedImages.length === filteredImages.length ? 'Deselect All' : 'Select All'}
              </AdminButton>
              <AdminButton variant="danger" size="sm" onClick={handleDeleteSelected}>
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </AdminButton>
            </div>
          )}
        </AdminCard>

        {/* Image Grid/List */}
        {filteredImages.length === 0 ? (
          <AdminCard className="p-12 text-center">
            <Image className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No images found</p>
            <p className="text-sm text-neutral-600 mt-1">
              Try adjusting your search or filter
            </p>
          </AdminCard>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map(image => (
              <AdminCard
                key={image.id}
                className={`group relative overflow-hidden cursor-pointer transition-all ${
                  selectedImages.includes(image.id) ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => handleSelectImage(image.id)}
              >
                <div className="aspect-square bg-admin-card-hover relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg'
                    }}
                  />

                  {/* Selection Checkbox */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedImages.includes(image.id)
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-white/50 bg-black/30 opacity-0 group-hover:opacity-100'
                  }`}>
                    {selectedImages.includes(image.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyUrl(image.url)
                      }}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Copy URL"
                    >
                      {copiedUrl === image.url ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm text-white truncate">{image.productName}</p>
                  <div className="flex items-center justify-between mt-1">
                    <AdminBadge variant="default" className="text-xs">
                      {image.collection.toUpperCase()}
                    </AdminBadge>
                    <span className="text-xs text-neutral-500">
                      {formatDate(image.uploadedAt)}
                    </span>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        ) : (
          <AdminCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="w-8 p-3">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-400">Preview</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-400">Collection</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-400">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map(image => (
                  <tr key={image.id} className="border-b border-admin-border hover:bg-admin-card-hover">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleSelectImage(image.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-12 h-12 rounded object-cover bg-admin-card-hover"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <p className="text-white">{image.productName}</p>
                      <p className="text-xs text-neutral-500 truncate max-w-xs">{image.url}</p>
                    </td>
                    <td className="p-3">
                      <AdminBadge variant="default">
                        {image.collection.toUpperCase()}
                      </AdminBadge>
                    </td>
                    <td className="p-3 text-neutral-400 text-sm">
                      {formatDate(image.uploadedAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyUrl(image.url)}
                          className="p-1.5 text-neutral-400 hover:text-white"
                          title="Copy URL"
                        >
                          {copiedUrl === image.url ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-white"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          className="p-1.5 text-neutral-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminCard>
        )}

        {/* Results Count */}
        <p className="text-sm text-neutral-500 mt-4 text-center">
          Showing {filteredImages.length} of {images.length} images
        </p>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseUploadModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-admin-bg border border-admin-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-admin-border">
                <h2 className="text-lg font-semibold text-white">Upload Images</h2>
                <button
                  onClick={handleCloseUploadModal}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-admin-card-hover rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Select Product to add images to
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
                  >
                    <option value="">Select a product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku || product.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload Zone */}
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Upload Images
                  </label>
                  <ImageUploadZone
                    onUpload={handleImageUpload}
                    folder={selectedProductId ? `mulyam/products/${selectedProductId}` : 'mulyam/products/temp'}
                    disabled={!selectedProductId}
                  />
                  {!selectedProductId && (
                    <p className="text-xs text-yellow-500 mt-2">
                      Please select a product first
                    </p>
                  )}
                </div>

                {/* Uploaded Images Preview */}
                {uploadedUrls.length > 0 && (
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">
                      Uploaded Images ({uploadedUrls.length})
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-admin-card-hover">
                          <img
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setUploadedUrls(prev => prev.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-admin-border">
                <AdminButton variant="secondary" onClick={handleCloseUploadModal}>
                  Cancel
                </AdminButton>
                <AdminButton
                  onClick={handleSaveUploadedImages}
                  disabled={!selectedProductId || uploadedUrls.length === 0}
                >
                  Save {uploadedUrls.length} Image{uploadedUrls.length !== 1 ? 's' : ''}
                </AdminButton>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default ImagesPage
