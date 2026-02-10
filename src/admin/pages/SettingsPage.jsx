import { useState, useEffect, useMemo } from 'react'
import {
  User,
  Truck,
  LayoutGrid,
  Star,
  ChevronUp,
  ChevronDown,
  GripVertical,
  X,
  Plus,
  Save,
  Check,
  Loader2,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminToggle, AdminInput, useToast } from '../components/ui'
import { useProducts, useSettings, useSettingsMutations } from '../../hooks'

// Sortable featured product item component
function SortableFeaturedItem({ id, index, product, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-admin-card-hover rounded-lg"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-4 h-4 text-neutral-600" />
      </button>
      <span className="w-6 h-6 bg-admin-border rounded flex items-center justify-center text-xs text-neutral-400">
        {index + 1}
      </span>
      <img
        src={product.images?.[0] || '/placeholder.jpg'}
        alt={product.name}
        className="w-10 h-10 rounded object-cover bg-admin-border"
      />
      <div className="flex-1">
        <p className="text-white text-sm">{product.name}</p>
        <p className="text-xs text-neutral-500">
          {product.collection?.toUpperCase()} | ₹{product.price}
        </p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="p-1 text-neutral-400 hover:text-red-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

const defaultSettings = {
  storeName: 'Mulyam Jewels',
  whatsapp: '919523882449',
  instagram: '@mulyam_jewels',
  email: 'Founders@mulyamjewels.com',
  maintenanceMode: false,
  shippingCost: 49,
  freeShippingAbove: 1499,
}

const defaultSections = [
  { id: 'hero', name: 'Hero', enabled: true },
  { id: 'collections', name: 'Collections', enabled: true },
  { id: 'featured', name: 'Featured Products', enabled: true },
  { id: 'why-choose', name: 'Why Choose Us', enabled: true },
  { id: 'cta', name: 'CTA Banner', enabled: true },
]

function SettingsPage() {
  const toast = useToast()

  // DnD sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch products from Supabase
  const { data: rawProducts, loading: productsLoading } = useProducts()

  // Fetch settings from Supabase
  const { data: dbSettings, loading: settingsLoading } = useSettings()
  const { upsertSetting, loading: savingSettings } = useSettingsMutations()

  // Transform products for UI
  const products = useMemo(() => {
    return rawProducts.map(p => ({
      id: p.id,
      name: p.name,
      collection: p.collection,
      price: p.price,
      images: p.images || [],
    }))
  }, [rawProducts])

  // Initialize settings from DB or defaults
  const [settings, setSettings] = useState(defaultSettings)
  const [sections, setSections] = useState(defaultSections)
  const [featuredProducts, setFeaturedProducts] = useState([])

  // Load settings from DB when available
  useEffect(() => {
    if (dbSettings) {
      // Brand & Contact settings
      setSettings(prev => ({
        ...prev,
        storeName: dbSettings.store_name || prev.storeName,
        whatsapp: dbSettings.whatsapp || prev.whatsapp,
        instagram: dbSettings.instagram || prev.instagram,
        email: dbSettings.email || prev.email,
        maintenanceMode: dbSettings.maintenance_mode === 'true' || dbSettings.maintenance_mode === true,
        shippingCost: parseInt(dbSettings.shipping_cost) || prev.shippingCost,
        freeShippingAbove: parseInt(dbSettings.free_shipping_above) || prev.freeShippingAbove,
      }))

      // Sections
      if (dbSettings.homepage_sections) {
        try {
          const parsedSections = typeof dbSettings.homepage_sections === 'string'
            ? JSON.parse(dbSettings.homepage_sections)
            : dbSettings.homepage_sections
          if (Array.isArray(parsedSections) && parsedSections.length > 0) {
            setSections(parsedSections)
          }
        } catch {}
      }

      // Featured products
      if (dbSettings.featured_products) {
        try {
          const parsedFeatured = typeof dbSettings.featured_products === 'string'
            ? JSON.parse(dbSettings.featured_products)
            : dbSettings.featured_products
          if (Array.isArray(parsedFeatured)) {
            setFeaturedProducts(parsedFeatured)
          }
        } catch {}
      }
    }
  }, [dbSettings])

  // Set initial featured products when products load (if not set from DB)
  useEffect(() => {
    if (products.length > 0 && featuredProducts.length === 0 && !dbSettings?.featured_products) {
      setFeaturedProducts(products.slice(0, 5).map(p => p.id))
    }
  }, [products, featuredProducts.length, dbSettings])

  const [editingBrand, setEditingBrand] = useState(false)
  const [editingShipping, setEditingShipping] = useState(false)
  const [displayCount, setDisplayCount] = useState(8)
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Mark initial load complete after settings are loaded
  useEffect(() => {
    if (!settingsLoading && !productsLoading && dbSettings) {
      // Small delay to allow state to settle
      const timer = setTimeout(() => setInitialLoadComplete(true), 500)
      return () => clearTimeout(timer)
    }
  }, [settingsLoading, productsLoading, dbSettings])

  // Track changes - only after initial load is complete
  useEffect(() => {
    if (initialLoadComplete) {
      setHasUnsavedChanges(true)
    }
  }, [settings, sections, featuredProducts])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Persist settings to Supabase
  const saveSettings = async () => {
    try {
      // Save all settings to Supabase
      await Promise.all([
        upsertSetting('store_name', settings.storeName),
        upsertSetting('whatsapp', settings.whatsapp),
        upsertSetting('instagram', settings.instagram),
        upsertSetting('email', settings.email),
        upsertSetting('maintenance_mode', String(settings.maintenanceMode)),
        upsertSetting('shipping_cost', String(settings.shippingCost)),
        upsertSetting('free_shipping_above', String(settings.freeShippingAbove)),
        upsertSetting('homepage_sections', JSON.stringify(sections)),
        upsertSetting('featured_products', JSON.stringify(featuredProducts)),
      ])

      setHasUnsavedChanges(false)
      toast.success('Settings saved successfully')
      setEditingBrand(false)
      setEditingShipping(false)
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message)
    }
  }

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const moveSection = (id, direction) => {
    const index = sections.findIndex((s) => s.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    )
      return

    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    setSections(newSections)
  }

  const removeFeaturedProduct = (productId) => {
    setFeaturedProducts((prev) => prev.filter((id) => id !== productId))
    toast.info('Product removed from featured')
  }

  const addFeaturedProduct = (productId) => {
    if (featuredProducts.includes(productId)) {
      toast.error('Product already featured')
      return
    }
    if (featuredProducts.length >= 15) {
      toast.error('Maximum 15 featured products allowed')
      return
    }
    setFeaturedProducts(prev => [...prev, productId])
    setShowProductPicker(false)
    toast.success('Product added to featured')
  }

  // Handle drag end for featured products reordering
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFeaturedProducts((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const availableProducts = products.filter(p => !featuredProducts.includes(p.id))

  const loading = productsLoading || settingsLoading

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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-neutral-400 mt-1">Manage your store configuration</p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                Unsaved changes
              </span>
            )}
            <AdminButton onClick={saveSettings} disabled={savingSettings}>
              {savingSettings ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hasUnsavedChanges ? (
                <Save className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {savingSettings ? 'Saving...' : hasUnsavedChanges ? 'Save All Changes' : 'Saved'}
            </AdminButton>
          </div>
        </div>

        <div className="space-y-6">
          {/* Brand & Contact */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-neutral-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Brand & Contact</h2>
                  <p className="text-sm text-neutral-500">Store identity and contact information</p>
                </div>
              </div>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => setEditingBrand(!editingBrand)}
              >
                {editingBrand ? 'Cancel' : 'Edit'}
              </AdminButton>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between py-3 border-b border-admin-border">
              <div>
                <p className="text-white">Maintenance Mode</p>
                <p className="text-sm text-neutral-500">
                  When enabled, customers see a "Coming soon" page
                </p>
              </div>
              <AdminToggle
                checked={settings.maintenanceMode}
                onChange={(checked) =>
                  setSettings((prev) => ({ ...prev, maintenanceMode: checked }))
                }
              />
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-neutral-500">Store Name</p>
                <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                  {settings.storeName}
                </p>
                <p className="text-xs text-neutral-600 mt-1">Store name is fixed</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">WhatsApp Number</p>
                {editingBrand ? (
                  <AdminInput
                    value={settings.whatsapp}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                    {settings.whatsapp}
                  </p>
                )}
                <p className="text-xs text-neutral-600 mt-1">
                  Numbers only, with country code (e.g., 919876543210)
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Instagram Handle</p>
                {editingBrand ? (
                  <AdminInput
                    value={settings.instagram}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, instagram: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                    {settings.instagram}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-neutral-500">Contact Email</p>
                {editingBrand ? (
                  <AdminInput
                    value={settings.email}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                    {settings.email}
                  </p>
                )}
              </div>
            </div>
          </AdminCard>

          {/* Shipping */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-neutral-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Shipping</h2>
                  <p className="text-sm text-neutral-500">
                    Configure shipping costs and free shipping threshold
                  </p>
                </div>
              </div>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => setEditingShipping(!editingShipping)}
              >
                {editingShipping ? 'Cancel' : 'Edit'}
              </AdminButton>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Shipping Cost</p>
                {editingShipping ? (
                  <AdminInput
                    type="number"
                    value={settings.shippingCost}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shippingCost: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                    ₹{settings.shippingCost}
                  </p>
                )}
                <p className="text-xs text-neutral-600 mt-1">
                  Applied to orders below free shipping threshold
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Free Shipping Above</p>
                {editingShipping ? (
                  <AdminInput
                    type="number"
                    value={settings.freeShippingAbove}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        freeShippingAbove: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  <p className="text-white bg-admin-card-hover px-3 py-2 rounded-md mt-1">
                    ₹{settings.freeShippingAbove}
                  </p>
                )}
                <p className="text-xs text-neutral-600 mt-1">
                  Orders above this amount get free shipping
                </p>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  Preview: Orders below ₹{settings.freeShippingAbove} will be charged ₹{settings.shippingCost} for shipping. Orders of ₹{settings.freeShippingAbove} or above get{' '}
                  <span className="text-green-400 underline">free shipping</span>.
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Homepage Sections */}
          <AdminCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <LayoutGrid className="w-5 h-5 text-neutral-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">Homepage Sections</h2>
                <p className="text-sm text-neutral-500">Drag to reorder, toggle to show/hide</p>
              </div>
            </div>

            <div className="space-y-2">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 p-3 bg-admin-card-hover rounded-lg"
                >
                  <GripVertical className="w-4 h-4 text-neutral-600 cursor-grab" />
                  <AdminToggle
                    checked={section.enabled}
                    onChange={() => toggleSection(section.id)}
                    size="sm"
                  />
                  <span className="flex-1 text-white">{section.name}</span>
                  {section.enabled && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-600 mt-3">
              Disabled sections won't appear on the homepage but their settings are preserved.
            </p>
          </AdminCard>

          {/* Featured Products */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-neutral-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Featured Products</h2>
                  <p className="text-sm text-neutral-500">
                    Select products to feature on homepage carousel
                  </p>
                </div>
              </div>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => setShowProductPicker(!showProductPicker)}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </AdminButton>
            </div>

            {/* Product Picker */}
            {showProductPicker && (
              <div className="mb-4 p-4 bg-admin-card-hover rounded-lg border border-admin-border">
                <p className="text-sm text-neutral-400 mb-3">Select a product to feature:</p>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableProducts.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      All products are already featured
                    </p>
                  ) : (
                    availableProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => addFeaturedProduct(product.id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-admin-border rounded-lg transition-colors"
                      >
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-admin-border"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-xs text-neutral-500">
                            {product.collection?.toUpperCase()} | ₹{product.price}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-neutral-400" />
                      </button>
                    ))
                  )}
                </div>
                <button
                  onClick={() => setShowProductPicker(false)}
                  className="mt-3 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-400">Display Count</p>
                <p className="text-xs text-neutral-600">
                  How many products to show on homepage (you can select up to 15 as buffer)
                </p>
              </div>
              <select
                value={displayCount}
                onChange={(e) => setDisplayCount(parseInt(e.target.value))}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                <option value={4}>4 products</option>
                <option value={6}>6 products</option>
                <option value={8}>8 products</option>
                <option value={10}>10 products</option>
                <option value={12}>12 products</option>
              </select>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={featuredProducts}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {featuredProducts.length === 0 ? (
                    <p className="text-neutral-500 text-center py-4">No featured products selected</p>
                  ) : (
                    featuredProducts.map((productId, index) => {
                      const product = products.find((p) => p.id === productId)
                      if (!product) return null
                      return (
                        <SortableFeaturedItem
                          key={productId}
                          id={productId}
                          index={index}
                          product={product}
                          onRemove={removeFeaturedProduct}
                        />
                      )
                    })
                  )}
                </div>
              </SortableContext>
            </DndContext>

            <p className="text-xs text-neutral-600 mt-3">
              {featuredProducts.length}/15 products selected. Products below the display count
              serve as buffer when items go out of stock.
            </p>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsPage
