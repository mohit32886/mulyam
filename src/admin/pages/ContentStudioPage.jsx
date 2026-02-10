import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Check, AlertCircle, Sparkles, Loader2 } from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminBadge } from '../components/ui'
import { useProducts } from '../hooks'

function ContentStudioPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [collectionFilter, setCollectionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Fetch products from Supabase
  const { data: rawProducts, loading, error } = useProducts()

  // Transform to UI format
  const allProducts = useMemo(() => {
    return rawProducts.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      collection: p.collection,
      category: p.category,
      description: p.description,
      images: p.images || [],
    }))
  }, [rawProducts])

  // Mock content status for products
  const productStatus = useMemo(() => {
    return allProducts.map((p) => ({
      ...p,
      nameStatus: p.name ? 'complete' : 'needs',
      descStatus: p.description ? 'complete' : 'needs',
    }))
  }, [])

  const stats = {
    total: productStatus.length,
    needsName: productStatus.filter((p) => p.nameStatus === 'needs').length,
    needsDesc: productStatus.filter((p) => p.descStatus === 'needs').length,
    complete: productStatus.filter(
      (p) => p.nameStatus === 'complete' && p.descStatus === 'complete'
    ).length,
  }

  const filteredProducts = useMemo(() => {
    let result = [...productStatus]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
      )
    }

    if (collectionFilter !== 'all') {
      result = result.filter((p) => p.collection === collectionFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (activeTab === 'needs-name') {
      result = result.filter((p) => p.nameStatus === 'needs')
    } else if (activeTab === 'needs-desc') {
      result = result.filter((p) => p.descStatus === 'needs')
    } else if (activeTab === 'complete') {
      result = result.filter(
        (p) => p.nameStatus === 'complete' && p.descStatus === 'complete'
      )
    }

    return result
  }, [productStatus, searchQuery, collectionFilter, categoryFilter, activeTab])

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Studio</h1>
            <p className="text-neutral-400 mt-1">
              Generate and manage product names and descriptions
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          {[
            { id: 'all', label: 'Total', value: stats.total, color: 'text-white' },
            { id: 'needs-name', label: 'Needs Name', value: stats.needsName, color: 'text-yellow-400' },
            { id: 'needs-desc', label: 'Needs Desc', value: stats.needsDesc, color: 'text-orange-400' },
            { id: 'complete', label: 'Complete', value: stats.complete, color: 'text-green-400' },
          ].map((stat) => (
            <button
              key={stat.id}
              onClick={() => setActiveTab(stat.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === stat.id
                  ? 'bg-admin-card-hover border border-admin-border'
                  : 'hover:bg-admin-card-hover'
              }`}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral-500">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <AdminCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                <option value="all">All Collections</option>
                <option value="diva">DIVA</option>
                <option value="mini">MINI</option>
                <option value="paws">PAWS</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
              </select>
            </div>
          </div>
        </AdminCard>

        {/* Table */}
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="w-10 p-4">
                    <input type="checkbox" className="rounded bg-admin-card-hover border-admin-border" />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Name Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">
                    Description Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice(0, 20).map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-admin-border hover:bg-admin-card-hover transition-colors"
                  >
                    <td className="p-4">
                      <input type="checkbox" className="rounded bg-admin-card-hover border-admin-border" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-admin-card-hover"
                        />
                        <div>
                          <p className="text-white">{product.name}</p>
                          <p className="text-xs text-neutral-500">
                            {product.sku} · {product.collection} · {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {product.nameStatus === 'complete' ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                          <Check className="w-4 h-4" />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Needs Name
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.descStatus === 'complete' ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                          <Check className="w-4 h-4" />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Needs Desc
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <AdminButton variant="ghost" size="sm">
                          {product.nameStatus === 'complete' ? 'Regen Name' : 'Generate Name'}
                        </AdminButton>
                        <AdminButton variant="ghost" size="sm">
                          {product.descStatus === 'complete' ? 'Regen Desc' : 'Generate Desc'}
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
            <p className="text-sm text-neutral-400">
              Showing 1 to {Math.min(20, filteredProducts.length)} of {filteredProducts.length}
            </p>
            {filteredProducts.length > 20 && (
              <button className="text-sm text-orange-500 hover:text-orange-400">Next</button>
            )}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}

export default ContentStudioPage
