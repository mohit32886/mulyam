import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Download,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminBadge, AdminToggle, useToast } from '../components/ui'
import { EditProductPanel } from '../components/catalogue'
import { useProducts, useProductMutations } from '../hooks'
import { transformProductFromDb, transformProductToDb } from '../../utils/caseTransform'

// Helper function to check if product has all required content fields filled
const isProductComplete = (product) => {
  const requiredFields = [
    product.name?.trim(),                    // Product Name
    product.images?.length > 0,              // At least 1 image
    product.price > 0,                       // Selling Price
    product.sku?.trim(),                     // SKU
    product.category?.trim(),                // Category assigned
    product.description?.trim(),             // Product Description
  ]
  return requiredFields.every(Boolean)
}

function CataloguePage() {
  const toast = useToast()

  // Fetch products from Supabase
  const { data: products, loading, error, refetch } = useProducts()
  const { updateProduct, deleteProduct, loading: mutating } = useProductMutations()

  const [searchQuery, setSearchQuery] = useState('')
  const [collectionFilter, setCollectionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [activeTab, setActiveTab] = useState('all')

  // Pagination state
  const ITEMS_PER_PAGE = 25
  const [currentPage, setCurrentPage] = useState(1)

  // Edit panel state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length
    const live = products.filter((p) => p.is_live !== false && p.in_stock !== false).length
    const draft = products.filter((p) => p.is_live === false || p.in_stock === false).length
    const outOfStock = products.filter((p) => p.in_stock === false).length
    const incomplete = products.filter((p) => !isProductComplete(p)).length
    return { total, live, draft, outOfStock, incomplete }
  }, [products])

  const tabs = [
    { id: 'all', label: 'Products', count: stats.total },
    { id: 'live', label: 'Live', count: stats.live },
    { id: 'draft', label: 'Draft', count: stats.draft },
    { id: 'issues', label: 'Issues', count: stats.incomplete },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
      )
    }

    // Collection filter
    if (collectionFilter !== 'all') {
      result = result.filter((p) => p.collection === collectionFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    // Stock filter
    if (stockFilter === 'instock') {
      result = result.filter((p) => p.in_stock !== false)
    } else if (stockFilter === 'outofstock') {
      result = result.filter((p) => p.in_stock === false)
    }

    // Tab filter
    if (activeTab === 'live') {
      result = result.filter((p) => p.is_live !== false && p.in_stock !== false)
    } else if (activeTab === 'draft') {
      result = result.filter((p) => p.is_live === false || p.in_stock === false)
    } else if (activeTab === 'issues') {
      result = result.filter((p) => !isProductComplete(p))
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'sku':
        result.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''))
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      default: // newest
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }

    return result
  }, [products, searchQuery, collectionFilter, categoryFilter, stockFilter, activeTab, sortBy])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, collectionFilter, categoryFilter, stockFilter, activeTab, sortBy])

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle product row click
  const handleRowClick = (product, e) => {
    if (e.target.closest('input') || e.target.closest('[role="switch"]')) {
      return
    }
    setSelectedProduct(product)
    setIsPanelOpen(true)
  }

  // Handle save product
  const handleSaveProduct = async (updatedProduct) => {
    // Transform from camelCase (form) to snake_case (DB) using utility
    const dbProduct = transformProductToDb(updatedProduct)

    const { error } = await updateProduct(updatedProduct.id, dbProduct)

    if (error) {
      toast.error('Failed to update product')
    } else {
      toast.success('Product updated successfully')
      setIsPanelOpen(false)
      setSelectedProduct(null)
      refetch()
    }
  }

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    const { error } = await deleteProduct(productId)

    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success('Product deleted successfully')
      setIsPanelOpen(false)
      setSelectedProduct(null)
      refetch()
    }
  }

  // Handle toggle change
  const handleToggleInStock = async (productId, checked) => {
    const { error } = await updateProduct(productId, { in_stock: checked })
    if (error) {
      toast.error('Failed to update stock status')
    } else {
      toast.success(checked ? 'Product marked as in stock' : 'Product marked as out of stock')
      refetch()
    }
  }

  const handleToggleLive = async (productId, checked) => {
    const { error } = await updateProduct(productId, { is_live: checked })
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(checked ? 'Product is now live' : 'Product set to draft')
      refetch()
    }
  }

  // Handle stock edit
  const handleStockEdit = async (productId, currentStock) => {
    const newStock = window.prompt('Enter new stock quantity:', currentStock || 10)
    if (newStock !== null) {
      const stockNum = parseInt(newStock)
      if (!isNaN(stockNum) && stockNum >= 0) {
        const { error } = await updateProduct(productId, { stock: stockNum })
        if (error) {
          toast.error('Failed to update stock')
        } else {
          toast.success(`Stock updated to ${stockNum}`)
          refetch()
        }
      }
    }
  }

  // Transform product for edit panel (snake_case to camelCase) using utility
  const transformForEdit = (product) => {
    return transformProductFromDb(product)
  }

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load products</h2>
          <p className="text-neutral-400 mb-4">{error}</p>
          <AdminButton onClick={refetch}>Try Again</AdminButton>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Catalogue</h1>

          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    activeTab === tab.id
                      ? 'bg-admin-card-hover text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold">{tab.count}</span>
                  <span className="ml-1">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <AdminButton variant="secondary" size="sm">
                <Download className="w-4 h-4" />
                Data
              </AdminButton>
              <Link to="/catalogue/new">
                <AdminButton size="sm">
                  <Plus className="w-4 h-4" />
                  Add Product
                </AdminButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AdminCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex gap-2">
              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm focus:outline-none"
              >
                <option value="all">All Collections</option>
                <option value="diva">DIVA</option>
                <option value="mini">MINI</option>
                <option value="paws">PAWS</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
                <option value="rings">Rings</option>
                <option value="anklets">Anklets</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm focus:outline-none"
              >
                <option value="all">All Stock</option>
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="sku">SKU</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </AdminCard>

        {/* Product Table */}
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="w-10 p-4">
                    <input type="checkbox" className="rounded bg-admin-card-hover border-admin-border" />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">In Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Content</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Live</th>
                  <th className="w-10 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={(e) => handleRowClick(product, e)}
                    className="border-b border-admin-border hover:bg-admin-card-hover cursor-pointer transition-colors"
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded bg-admin-card-hover border-admin-border" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-20 h-20 rounded-lg object-cover bg-admin-card-hover"
                        />
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-xs text-neutral-500">
                            {product.sku} · {product.collection} · {product.category}
                          </p>
                          <div className="flex gap-1 mt-1">
                            <span className="text-xs text-orange-400">Description</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">₹{product.price}</span>
                      {product.original_price && (
                        <span className="text-neutral-500 line-through ml-1">
                          ₹{product.original_price}
                        </span>
                      )}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStockEdit(product.id, product.stock)}
                        className="px-2 py-1 bg-admin-card-hover rounded text-sm text-white hover:bg-admin-border transition-colors"
                        disabled={mutating}
                      >
                        {product.stock || 10}
                      </button>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <AdminToggle
                        checked={product.in_stock !== false}
                        onChange={(checked) => handleToggleInStock(product.id, checked)}
                        size="sm"
                        disabled={mutating}
                      />
                    </td>
                    <td className="p-4">
                      <AdminBadge variant={isProductComplete(product) ? 'success' : 'danger'}>
                        {isProductComplete(product) ? 'Complete' : 'Incomplete'}
                      </AdminBadge>
                    </td>
                    <td className="p-4">
                      <AdminBadge variant={product.is_live !== false && product.in_stock !== false ? 'success' : 'warning'}>
                        {product.is_live !== false && product.in_stock !== false ? 'Live' : 'Draft'}
                      </AdminBadge>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <AdminToggle
                        checked={product.is_live !== false}
                        onChange={(checked) => handleToggleLive(product.id, checked)}
                        size="sm"
                        disabled={mutating}
                      />
                    </td>
                    <td className="p-4">
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
            <p className="text-sm text-neutral-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Previous
                </button>
              )}
              {totalPages > 1 && (
                <span className="text-sm text-neutral-500">
                  Page {currentPage} of {totalPages}
                </span>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Edit Product Panel */}
      <EditProductPanel
        product={transformForEdit(selectedProduct)}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </AdminLayout>
  )
}

export default CataloguePage
