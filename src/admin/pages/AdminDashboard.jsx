import { Link } from 'react-router-dom'
import {
  Package,
  CheckCircle,
  FileText,
  AlertCircle,
  ShoppingBag,
  Plus,
  Sparkles,
  Tag,
  Settings,
  Image,
  Clock,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard } from '../components/ui'
import { useProducts } from '../../hooks'

function AdminDashboard() {
  // Fetch products from Supabase
  const { data: products, loading, error } = useProducts()

  // Calculate stats from products
  const totalProducts = products.length
  const liveProducts = products.filter((p) => p.is_live).length
  const draftProducts = products.filter((p) => !p.is_live).length
  const outOfStock = products.filter((p) => p.stock === 0 || !p.in_stock).length || 0

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Live',
      value: liveProducts,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Draft',
      value: draftProducts,
      icon: FileText,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ]

  const catalogueLinks = [
    { to: '/admin/catalogue', label: 'All Products', icon: ShoppingBag },
    { to: '/admin/catalogue/new', label: 'Add Product', icon: Plus },
    { to: '/admin/catalogue/content-studio', label: 'Content Studio', icon: Sparkles },
  ]

  const storeLinks = [
    { to: '/admin/offers', label: 'Offers & Coupons', icon: Tag },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const mediaLinks = [
    { to: '/admin/images', label: 'Images', icon: Image },
    { to: '/admin/time-machine', label: 'Time Machine', icon: Clock },
  ]

  const comingSoon = ['Orders Management', 'Analytics Dashboard', 'Customer Insights']

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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Error banner if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-black font-serif font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">MULYAM</h1>
          <p className="text-neutral-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <AdminCard key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-neutral-400">{stat.label}</p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Catalogue */}
          <AdminCard className="p-6">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Catalogue
            </h3>
            <div className="space-y-2">
              {catalogueLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-admin-card-hover transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-neutral-400" />
                    <span className="text-white">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                </Link>
              ))}
            </div>
          </AdminCard>

          {/* Store */}
          <AdminCard className="p-6">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Store
            </h3>
            <div className="space-y-2">
              {storeLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-admin-card-hover transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-neutral-400" />
                    <span className="text-white">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                </Link>
              ))}
            </div>
          </AdminCard>

          {/* Media */}
          <AdminCard className="p-6">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Media
            </h3>
            <div className="space-y-2">
              {mediaLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-admin-card-hover transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-neutral-400" />
                    <span className="text-white">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                </Link>
              ))}
            </div>
          </AdminCard>

          {/* Coming Soon */}
          <AdminCard className="p-6">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              Coming Soon
            </h3>
            <div className="space-y-2">
              {comingSoon.map((item) => (
                <p key={item} className="text-neutral-400 py-2">
                  {item}
                </p>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-600 text-sm mt-8">
          v1.0 - January 2025
        </p>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
