import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  Package,
  FileText,
  Settings,
  Tag,
  Image,
  Clock,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react'
import { products as initialProducts } from '../../../data/products'

const STORAGE_KEY = 'mulyam_admin_products'

const pages = [
  { id: 'dashboard', name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { id: 'catalogue', name: 'Catalogue', path: '/admin/catalogue', icon: Package },
  { id: 'add-product', name: 'Add Product', path: '/admin/catalogue/new', icon: Package },
  { id: 'content-studio', name: 'Content Studio', path: '/admin/catalogue/content-studio', icon: FileText },
  { id: 'offers', name: 'Offers & Coupons', path: '/admin/offers', icon: Tag },
  { id: 'settings', name: 'Settings', path: '/admin/settings', icon: Settings },
  { id: 'images', name: 'Images', path: '/admin/images', icon: Image },
  { id: 'time-machine', name: 'Time Machine', path: '/admin/time-machine', icon: Clock },
]

function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Get products from localStorage or initial data
  const products = useMemo(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return initialProducts
      }
    }
    return initialProducts
  }, [isOpen])

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        pages: pages.slice(0, 5),
        products: [],
      }
    }

    const q = query.toLowerCase()

    const filteredPages = pages.filter(
      (p) => p.name.toLowerCase().includes(q)
    )

    const filteredProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q)
      )
      .slice(0, 5)

    return {
      pages: filteredPages,
      products: filteredProducts,
    }
  }, [query, products])

  const allResults = [...results.pages, ...results.products]

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < allResults.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allResults.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (allResults[selectedIndex]) {
            handleSelect(allResults[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, allResults, selectedIndex])

  const handleSelect = (item) => {
    if (item.path) {
      // It's a page
      navigate(item.path)
    } else {
      // It's a product - navigate to catalogue with the product
      navigate('/admin/catalogue')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50">
        <div className="bg-admin-card border border-admin-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-admin-border">
            <Search className="w-5 h-5 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              placeholder="Search products, pages..."
              className="flex-1 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {/* Pages Section */}
            {results.pages.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-medium text-neutral-500 uppercase">
                  Pages
                </p>
                {results.pages.map((page, index) => {
                  const Icon = page.icon
                  const isSelected = selectedIndex === index
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleSelect(page)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-neutral-300 hover:bg-admin-card-hover'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{page.name}</span>
                      {isSelected && <ArrowRight className="w-4 h-4" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Products Section */}
            {results.products.length > 0 && (
              <div className="p-2 border-t border-admin-border">
                <p className="px-2 py-1 text-xs font-medium text-neutral-500 uppercase">
                  Products
                </p>
                {results.products.map((product, index) => {
                  const resultIndex = results.pages.length + index
                  const isSelected = selectedIndex === resultIndex
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-neutral-300 hover:bg-admin-card-hover'
                      }`}
                    >
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover bg-admin-card-hover"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-neutral-500">
                          {product.sku} · {product.collection}
                        </p>
                      </div>
                      {isSelected && <ArrowRight className="w-4 h-4" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {query && results.pages.length === 0 && results.products.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-neutral-500">No results found for "{query}"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-admin-border text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-admin-card-hover rounded text-neutral-400">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-admin-card-hover rounded text-neutral-400">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-admin-card-hover rounded text-neutral-400">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchModal
