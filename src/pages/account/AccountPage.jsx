import Layout from '../../components/layout/Layout'
import { ProtectedRoute, AccountNav, ProfileSection } from '../../components/account'
import { PageSEO } from '../../seo'

function AccountPage() {

  return (
    <Layout>
      <PageSEO title="My Account" noindex={true} />
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-2xl font-semibold mb-6">My Account</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <ProfileSection />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  )
}

export default AccountPage
