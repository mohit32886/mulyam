import { useState, useEffect } from 'react'
import { X, Sparkles, Trash2 } from 'lucide-react'
import { AdminButton, AdminInput, AdminSelect, AdminToggle, AdminTabs, TabsList, TabsTrigger, TabsContent } from '../ui'
import ImageUploadZone from '../ui/ImageUploadZone'
import SortableImageList from './SortableImageList'

function EditProductPanel({ product, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('details')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        collection: product.collection || 'diva',
        category: product.category || 'earrings',
        status: product.isLive ? 'live' : 'draft',
        color: product.color || 'Gold',
        material: product.material || 'Stainless Steel',
        plating: product.plating || '18K Gold Plated',
        size: product.size || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        costPrice: product.costPrice || 0,
        stock: product.stock || 10,
        inStock: product.inStock !== false,
        isBestseller: product.isBestseller || false,
        isNewArrival: product.isNewArrival || false,
        isTrending: product.isTrending || false,
        isSellingFast: product.isSellingFast || false,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        images: product.images || [],
      })
      setActiveTab('details')
    }
  }, [product])

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      // Auto-update inStock when stock quantity changes
      if (field === 'stock') {
        updated.inStock = value > 0
      }
      return updated
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave({ ...product, ...formData, isLive: formData.status === 'live' })
    setIsSaving(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id)
    }
  }

  const discount = formData.originalPrice > formData.price
    ? Math.round((1 - formData.price / formData.originalPrice) * 100)
    : 0

  if (!isOpen || !product) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-admin-bg border-l border-admin-border z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-admin-border">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover bg-admin-card-hover"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">{product.name}</h2>
            <p className="text-sm text-neutral-500">{product.sku}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-admin-card-hover rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <AdminTabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-admin-border">
            <TabsList className="px-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Collection</label>
                  <AdminSelect
                    value={formData.collection}
                    onChange={(e) => handleChange('collection', e.target.value)}
                    options={[
                      { value: 'diva', label: 'DIVA' },
                      { value: 'mini', label: 'MINI' },
                      { value: 'paws', label: 'PAWS' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Category</label>
                  <AdminSelect
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={[
                      { value: 'earrings', label: 'Earrings' },
                      { value: 'bracelets', label: 'Bracelets' },
                      { value: 'necklaces', label: 'Necklaces' },
                      { value: 'rings', label: 'Rings' },
                      { value: 'anklets', label: 'Anklets' },
                      { value: 'chains', label: 'Chains' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Status</label>
                  <AdminSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'live', label: 'Live' },
                      { value: 'eol', label: 'End of Life' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Color</label>
                  <AdminInput
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    placeholder="e.g., Gold, Silver"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Material</label>
                  <AdminInput
                    value={formData.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                    placeholder="e.g., Stainless Steel"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Plating</label>
                  <AdminInput
                    value={formData.plating}
                    onChange={(e) => handleChange('plating', e.target.value)}
                    placeholder="e.g., 18K Gold Plated"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Size</label>
                  <AdminSelect
                    value={formData.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    options={[
                      { value: '', label: 'Select Size' },
                      { value: 'adjustable', label: 'Adjustable' },
                      { value: 'free-size', label: 'Free Size' },
                      { value: '14-inches', label: '14 inches' },
                      { value: '16-inches', label: '16 inches' },
                      { value: '18-inches', label: '18 inches' },
                      { value: '20-inches', label: '20 inches' },
                      { value: '22-inches', label: '22 inches' },
                      { value: 's', label: 'S' },
                      { value: 'm', label: 'M' },
                      { value: 'l', label: 'L' },
                      { value: 'xl', label: 'XL' },
                    ]}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="space-y-4">
                {/* Upload Zone */}
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Upload Images</p>
                  <p className="text-xs text-neutral-600 mb-3">Drag and drop images or click to browse</p>
                  <ImageUploadZone
                    onUpload={(url) => {
                      handleChange('images', [...(formData.images || []), url])
                    }}
                    folder={`mulyam/products/${product?.sku || 'unknown'}`}
                  />
                </div>

                {/* Image List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-neutral-400">Product Images</p>
                      <p className="text-xs text-neutral-600">Drag to reorder • First image is the main image</p>
                    </div>
                    {formData.images?.length > 0 && (
                      <span className="text-xs text-neutral-500">
                        {formData.images.length} image{formData.images.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <SortableImageList
                    images={formData.images || []}
                    onChange={(newImages) => handleChange('images', newImages)}
                    onRemove={(index) => {
                      const newImages = formData.images.filter((_, i) => i !== index)
                      handleChange('images', newImages)
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Price (Rs.)</label>
                  <AdminInput
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Compare Price (Rs.)</label>
                  <AdminInput
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleChange('originalPrice', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-neutral-600 mt-1">Original price shown with strikethrough</p>
                </div>

                {discount > 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">
                      Discount: {discount}% off
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Cost Price (Rs.)</label>
                  <AdminInput
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => handleChange('costPrice', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-neutral-600 mt-1">For internal tracking only</p>
                </div>

                {formData.costPrice > 0 && formData.price > 0 && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      Margin: Rs {formData.price - formData.costPrice} ({Math.round((1 - formData.costPrice / formData.price) * 100)}%)
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Stock Quantity</label>
                  <AdminInput
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg">
                  <div>
                    <p className="text-white">In Stock</p>
                    <p className="text-sm text-neutral-500">Show as available for purchase</p>
                  </div>
                  <AdminToggle
                    checked={formData.inStock}
                    onChange={(checked) => handleChange('inStock', checked)}
                  />
                </div>

                {/* Product Badges */}
                <div className="pt-4 border-t border-admin-border">
                  <p className="text-sm text-neutral-400 mb-3">Product Badges</p>

                  <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg mb-3">
                    <div>
                      <p className="text-white">Bestseller</p>
                      <p className="text-sm text-neutral-500">Show bestseller badge on product</p>
                    </div>
                    <AdminToggle
                      checked={formData.isBestseller}
                      onChange={(checked) => handleChange('isBestseller', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg mb-3">
                    <div>
                      <p className="text-white">New Arrival</p>
                      <p className="text-sm text-neutral-500">Show new arrival badge on product</p>
                    </div>
                    <AdminToggle
                      checked={formData.isNewArrival}
                      onChange={(checked) => handleChange('isNewArrival', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg mb-3">
                    <div>
                      <p className="text-white">Trending Now</p>
                      <p className="text-sm text-neutral-500">Show trending badge on product</p>
                    </div>
                    <AdminToggle
                      checked={formData.isTrending}
                      onChange={(checked) => handleChange('isTrending', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg">
                    <div>
                      <p className="text-white">Selling Fast</p>
                      <p className="text-sm text-neutral-500">Show selling fast badge on product</p>
                    </div>
                    <AdminToggle
                      checked={formData.isSellingFast}
                      onChange={(checked) => handleChange('isSellingFast', checked)}
                    />
                  </div>
                </div>

                {formData.stock <= 5 && formData.stock > 0 && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-400">
                      Low stock warning: Only {formData.stock} items left
                    </p>
                  </div>
                )}

                {formData.stock === 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">
                      Out of stock - Consider restocking or marking as unavailable
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-neutral-400">Product Name</label>
                    <button className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400">
                      <Sparkles className="w-3 h-3" />
                      Generate
                    </button>
                  </div>
                  <AdminInput
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-neutral-400">Short Description</label>
                    <button className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400">
                      <Sparkles className="w-3 h-3" />
                      Generate
                    </button>
                  </div>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => handleChange('shortDescription', e.target.value)}
                    placeholder="Brief product description..."
                    rows={3}
                    className="w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-neutral-400">Full Description</label>
                    <button className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400">
                      <Sparkles className="w-3 h-3" />
                      Generate
                    </button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Detailed product description..."
                    rows={5}
                    className="w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </AdminTabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-admin-border">
          <AdminButton variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </AdminButton>
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </AdminButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProductPanel
