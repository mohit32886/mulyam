import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { useProductSearch } from '../../hooks'
import { PlaceholderImage } from '../ui'

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')

  // Search products from Supabase with debounce
  const { results: searchResults, loading } = useProductSearch(query)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-lg max-h-[80vh] overflow-hidden animate-slide-down">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for jewelry..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[calc(80vh-73px)]">
          {loading && query.trim() && (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-tan" />
            </div>
          )}

          {!loading && query.trim() && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No products found for "{query}"</p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching for earrings, bracelets, or collection names
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>

              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-tan/10 rounded flex-shrink-0 overflow-hidden">
                      {product.images?.[0] && !product.images[0].includes('/images/products/') ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <PlaceholderImage category={product.category} className="rounded" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-dark line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {product.collection} • {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm">
                          Rs {product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-xs">
                            Rs {product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Start typing to search products</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Earrings', 'Bracelets', 'Gold', 'Kids', 'Pets'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchModal
