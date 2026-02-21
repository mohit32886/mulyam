import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Button } from '../components/ui'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCheckout } from '../hooks/medusa/useCheckout'
import { PageSEO } from '../seo'
import {
  CheckoutStepIndicator,
  ContactInfoStep,
  AddressStep,
  ShippingStep,
  PaymentStep,
  OrderConfirmation,
  OrderSummary,
} from '../components/checkout'

// Steps: 0=Contact, 1=Address, 2=Shipping, 3=Payment, 4=Confirmation
const STEP_CONTACT = 0
const STEP_ADDRESS = 1
const STEP_SHIPPING = 2
const STEP_PAYMENT = 3
const STEP_CONFIRMATION = 4

function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, items, totals, appliedCoupon, clearCart, refreshCart } = useCart()
  const { customer, isAuthenticated } = useAuth()
  const {
    setEmail,
    setAddresses,
    getShippingOptions,
    setShippingMethod,
    initPayment,
    updatePaymentSession,
    completeCheckout,
    order,
    loading,
    error,
    setError,
  } = useCheckout(cart?.id)

  const [currentStep, setCurrentStep] = useState(STEP_CONTACT)
  const [contactInfo, setContactInfo] = useState(null)
  const [addressInfo, setAddressInfo] = useState(null)
  const [shippingCost, setShippingCost] = useState(null)
  const [completedOrder, setCompletedOrder] = useState(null)

  // Contact step submit
  const handleContactSubmit = useCallback(async (data) => {
    try {
      await setEmail(data.email)
      setContactInfo(data)
      setCurrentStep(STEP_ADDRESS)
    } catch {
      // error is set in the hook
    }
  }, [setEmail])

  // Address step submit
  const handleAddressSubmit = useCallback(async (address) => {
    try {
      await setAddresses(address)
      await refreshCart()
      setAddressInfo(address)
      setCurrentStep(STEP_SHIPPING)
    } catch {
      // error is set in the hook
    }
  }, [setAddresses, refreshCart])

  // Shipping step submit
  const handleShippingSubmit = useCallback(async (optionId, selectedOption) => {
    try {
      await setShippingMethod(optionId)
      await refreshCart()
      setShippingCost(Number(selectedOption?.amount || 0))
      setCurrentStep(STEP_PAYMENT)
    } catch {
      // error is set in the hook
    }
  }, [setShippingMethod])

  // Payment complete
  const handlePaymentComplete = useCallback((completedOrder) => {
    setCompletedOrder(completedOrder)
    setCurrentStep(STEP_CONFIRMATION)
    // Create a new cart for next shopping session
    clearCart()
  }, [clearCart])

  // Empty cart (and not on confirmation page)
  if (items.length === 0 && currentStep !== STEP_CONFIRMATION) {
    return (
      <Layout>
        <PageSEO
          title="Checkout"
          description="Complete your purchase at Mulyam Jewels."
          noindex={true}
        />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="font-display text-2xl font-semibold text-gray-700 mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8">
              Add some beautiful pieces to get started
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Confirmation step - full width
  if (currentStep === STEP_CONFIRMATION) {
    return (
      <Layout>
        <PageSEO
          title="Checkout"
          description="Complete your purchase at Mulyam Jewels."
          noindex={true}
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <OrderConfirmation order={completedOrder || order} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageSEO
        title="Checkout"
        description="Complete your purchase at Mulyam Jewels."
        noindex={true}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 overflow-x-hidden w-full box-border">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-semibold mb-6">
          Checkout
        </h1>

        {/* Step indicator */}
        <CheckoutStepIndicator currentStep={currentStep} />

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Steps - Left side */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {currentStep === STEP_CONTACT && (
                <ContactInfoStep
                  initialEmail={cart?.email || customer?.email || ''}
                  initialPhone={customer?.phone || ''}
                  onSubmit={handleContactSubmit}
                  loading={loading}
                />
              )}

              {currentStep === STEP_ADDRESS && (
                <AddressStep
                  initialAddress={cart?.shipping_address || null}
                  initialPhone={contactInfo?.phone || ''}
                  onSubmit={handleAddressSubmit}
                  onBack={() => setCurrentStep(STEP_CONTACT)}
                  loading={loading}
                />
              )}

              {currentStep === STEP_SHIPPING && (
                <ShippingStep
                  getShippingOptions={getShippingOptions}
                  onSubmit={handleShippingSubmit}
                  onBack={() => setCurrentStep(STEP_ADDRESS)}
                  loading={loading}
                />
              )}

              {currentStep === STEP_PAYMENT && (
                <PaymentStep
                  cart={cart}
                  items={items}
                  totals={totals}
                  shippingCost={shippingCost}
                  initPayment={initPayment}
                  updatePaymentSession={updatePaymentSession}
                  completeCheckout={completeCheckout}
                  onBack={() => setCurrentStep(STEP_SHIPPING)}
                  onComplete={handlePaymentComplete}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Order Summary - Right side */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <OrderSummary
              items={items}
              totals={totals}
              appliedCoupon={appliedCoupon}
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CheckoutPage
