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
import { AdminCard, AdminButton, AdminBadge, useToast } from '../components/ui'
import { useProducts } from '../../hooks'

const collections = ['all', 'diva', 'mini', 'paws', 'bond', 'uncategorized']

function ImagesPage() {
  const toast = useToast()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [selectedImages, setSelectedImages] = useState([])
  const [copiedUrl, setCopiedUrl] = useState(null)

  // Fetch products from Supabase
  const { data: products, loading, error } = useProducts()

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

  // Filter images
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           img.productName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <AdminButton>
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
                placeholder="Search images..."
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
    </AdminLayout>
  )
}

export default ImagesPage
