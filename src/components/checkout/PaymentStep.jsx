import { useState, useCallback } from 'react'
import { ArrowLeft, ShieldCheck, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '../ui'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
const RAZORPAY_PROVIDER_ID = 'pp_razorpay_razorpay'

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_URL
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Razorpay. Please check your internet connection.'))
    document.body.appendChild(script)
  })
}

function PaymentStep({ cart, items, totals, shippingCost, initPayment, updatePaymentSession, completeCheckout, onBack, onComplete, loading: parentLoading }) {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [stage, setStage] = useState(null) // 'init' | 'razorpay' | 'completing'

  const totalAmount = totals.total + (shippingCost != null ? shippingCost / 100 : 0)

  const handlePay = useCallback(async () => {
    try {
      setProcessing(true)
      setError(null)

      // Step 1: Load Razorpay script
      setStage('init')
      await loadRazorpayScript()

      // Step 2: Initialize payment session in Medusa
      const paymentCollection = await initPayment(cart, RAZORPAY_PROVIDER_ID)

      // Find the Razorpay session from the payment collection
      const session = paymentCollection?.payment_sessions?.find(
        s => s.provider_id === RAZORPAY_PROVIDER_ID
      )

      if (!session?.data) {
        throw new Error('Failed to initialize payment session')
      }

      const { razorpay_order_id, key_id, amount, currency } = session.data

      if (!razorpay_order_id || !key_id) {
        throw new Error('Missing Razorpay order details')
      }

      // Step 3: Open Razorpay checkout modal
      setStage('razorpay')

      const razorpayResponse = await new Promise((resolve, reject) => {
        const options = {
          key: key_id,
          amount,
          currency: currency || 'INR',
          name: 'Mulyam Jewels',
          description: `Order (${items.length} items)`,
          order_id: razorpay_order_id,
          prefill: {
            email: cart?.email || '',
            contact: cart?.shipping_address?.phone ? `+91${cart.shipping_address.phone}` : '',
          },
          theme: {
            color: '#B19071',
          },
          handler: (response) => {
            resolve(response)
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment was cancelled'))
            },
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', (response) => {
          reject(new Error(response.error?.description || 'Payment failed'))
        })
        razorpay.open()
      })

      // Step 4: Update payment session with Razorpay response, then complete
      setStage('completing')

      // Update payment session data so authorizePayment can verify the signature
      if (updatePaymentSession && session?.id) {
        await updatePaymentSession(session.id, {
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        })
      }

      const result = await completeCheckout()

      if (result.success) {
        onComplete(result.order)
      } else {
        throw new Error(result.error || 'Failed to complete order')
      }
    } catch (err) {
      if (err.message === 'Payment was cancelled') {
        setError(null) // Don't show error for user cancellation
      } else {
        setError(err.message)
      }
    } finally {
      setProcessing(false)
      setStage(null)
    }
  }, [cart, items.length, initPayment, completeCheckout, onComplete])

  const stageText = {
    init: 'Initializing payment...',
    razorpay: 'Waiting for payment...',
    completing: 'Completing your order...',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold mb-1">Payment</h2>
        <p className="text-sm text-gray-500 mb-5">Review your order and pay securely with Razorpay.</p>
      </div>

      {/* Order Review */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide">Order Review</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium">
                {'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{'\u20B9'}{totals.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{'\u20B9'}{totals.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {shippingCost != null && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `\u20B9${(shippingCost / 100).toLocaleString('en-IN')}`}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-1 border-t border-gray-200">
            <span>Total</span>
            <span className="text-lg">{'\u20B9'}{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Summary */}
      {cart?.shipping_address && (
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-2">Delivering To</h3>
          <p className="text-sm text-gray-900">
            {cart.shipping_address.first_name} {cart.shipping_address.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {cart.shipping_address.address_1}
            {cart.shipping_address.address_2 && `, ${cart.shipping_address.address_2}`}
          </p>
          <p className="text-sm text-gray-600">
            {cart.shipping_address.city}, {cart.shipping_address.province} - {cart.shipping_address.postal_code}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4" />
        <span>Secured by Razorpay. Your payment info is never stored on our servers.</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
          disabled={processing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          variant="coral"
          size="lg"
          className="flex-[2]"
          onClick={handlePay}
          disabled={processing || parentLoading}
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {stageText[stage] || 'Processing...'}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {'\u20B9'}{totalAmount.toLocaleString('en-IN')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default PaymentStep
