import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminInput, AdminSelect, useToast } from '../components/ui'
import { useProductMutations } from '../hooks'

const collectionOptions = [
  { value: 'diva', label: 'Diva (Women)' },
  { value: 'mini', label: 'Mini (Kids)' },
  { value: 'paws', label: 'Paws (Pets)' },
]

const categoryOptions = [
  { value: 'earrings', label: 'Earrings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'rings', label: 'Rings' },
  { value: 'anklets', label: 'Anklets' },
  { value: 'sets', label: 'Sets' },
  { value: 'tags', label: 'Tags' },
]

const tagOptions = [
  { value: '', label: 'No Tag' },
  { value: 'new', label: 'New' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'limited', label: 'Limited' },
  { value: 'trending', label: 'Trending' },
]

function AddProductPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { createProduct, loading } = useProductMutations()

  const [formData, setFormData] = useState({
    name: '',
    collection: 'diva',
    category: 'earrings',
    description: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    tag: '',
    color: '',
    material: '',
    plating: '',
    size: '',
    weight: '',
  })

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Generate slug from name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create product object with snake_case for Supabase
    const productData = {
      id: slug,
      name: formData.name,
      slug: slug,
      collection: formData.collection,
      category: formData.category,
      description: formData.description || null,
      price: parseInt(formData.price) || 0,
      original_price: parseInt(formData.comparePrice) || null,
      cost_price: parseInt(formData.costPrice) || null,
      discount: formData.comparePrice && formData.price
        ? Math.round((1 - parseInt(formData.price) / parseInt(formData.comparePrice)) * 100)
        : null,
      tag: formData.tag || null,
      color: formData.color || 'Gold',
      material: formData.material || 'Stainless Steel',
      plating: formData.plating || '18K Gold Plated',
      size: formData.size || null,
      weight: formData.weight || null,
      sku: `MLM-${formData.collection.toUpperCase().slice(0, 1)}${formData.category.toUpperCase().slice(0, 1)}-${Date.now().toString().slice(-4)}`,
      images: [],
      in_stock: true,
      is_live: false, // Start as draft
      is_bestseller: formData.tag === 'bestseller',
      is_new: formData.tag === 'new',
      stock: 10,
    }

    const { data, error } = await createProduct(productData)

    if (error) {
      toast.error(`Failed to create product: ${error}`)
    } else {
      toast.success(`Product "${formData.name}" created successfully!`)
      navigate('/catalogue')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/catalogue" className="text-neutral-400 hover:text-white">
            Catalogue
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-300">New Product</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-orange-500">Add New Product</h1>
          <p className="text-neutral-400 mt-1">
            Create a new product. It will be saved as draft until you set it live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <AdminCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid gap-4">
              <AdminInput
                label="Name *"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter product name"
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <AdminSelect
                  label="Collection *"
                  value={formData.collection}
                  onChange={handleChange('collection')}
                  options={collectionOptions}
                />
                <AdminSelect
                  label="Category *"
                  value={formData.category}
                  onChange={handleChange('category')}
                  options={categoryOptions}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Description</label>
                <textarea
                  value={formData.description}
                  onChange={handleChange('description')}
                  rows={4}
                  className="w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </AdminCard>

          {/* Pricing */}
          <AdminCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <AdminInput
                label="Price (INR) *"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                placeholder="0"
                required
              />
              <AdminInput
                label="Compare Price"
                type="number"
                value={formData.comparePrice}
                onChange={handleChange('comparePrice')}
                placeholder="0"
              />
              <AdminInput
                label="Cost Price"
                type="number"
                value={formData.costPrice}
                onChange={handleChange('costPrice')}
                placeholder="0"
              />
            </div>
            {formData.comparePrice && formData.price && parseInt(formData.comparePrice) > parseInt(formData.price) && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400">
                  Discount: {Math.round((1 - parseInt(formData.price) / parseInt(formData.comparePrice)) * 100)}% off
                </p>
              </div>
            )}
          </AdminCard>

          {/* Details */}
          <AdminCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <AdminSelect
                label="Tag"
                value={formData.tag}
                onChange={handleChange('tag')}
                options={tagOptions}
              />
              <AdminInput
                label="Color"
                value={formData.color}
                onChange={handleChange('color')}
                placeholder="e.g., Gold"
              />
              <AdminInput
                label="Material"
                value={formData.material}
                onChange={handleChange('material')}
                placeholder="e.g., Stainless Steel"
              />
              <AdminInput
                label="Plating"
                value={formData.plating}
                onChange={handleChange('plating')}
                placeholder="e.g., 18K Gold Plated"
              />
              <AdminInput
                label="Size"
                value={formData.size}
                onChange={handleChange('size')}
                placeholder="e.g., Adjustable"
              />
              <AdminInput
                label="Weight"
                value={formData.weight}
                onChange={handleChange('weight')}
                placeholder="e.g., 10g"
              />
            </div>
          </AdminCard>

          {/* Notice */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              Product will be created as a draft. You can make it live from the catalogue page.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link to="/catalogue">
              <AdminButton type="button" variant="ghost" disabled={loading}>
                Cancel
              </AdminButton>
            </Link>
            <AdminButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </AdminButton>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddProductPage
