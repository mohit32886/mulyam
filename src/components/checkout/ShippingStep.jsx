import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Truck, Loader2 } from 'lucide-react'
import { Button } from '../ui'

function ShippingStep({ getShippingOptions, onSubmit, onBack, loading }) {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchOptions = async () => {
      try {
        setFetchLoading(true)
        setFetchError(null)
        const opts = await getShippingOptions()
        if (cancelled) return
        setOptions(opts)
        // Auto-select free shipping if available, otherwise first option
        const freeOpt = opts.find(o => Number(o.amount) === 0)
        setSelectedOption(freeOpt?.id || opts[0]?.id || null)
      } catch (err) {
        if (!cancelled) setFetchError(err.message)
      } finally {
        if (!cancelled) setFetchLoading(false)
      }
    }
    fetchOptions()
    return () => { cancelled = true }
  }, [getShippingOptions])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedOption) return
    const selected = options.find(o => o.id === selectedOption)
    onSubmit(selectedOption, selected)
  }

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">Loading shipping options...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load shipping options: {fetchError}</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">No shipping options available for your address.</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Update Address
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold mb-1">Shipping Method</h2>
        <p className="text-sm text-gray-500 mb-5">Choose how you'd like your order delivered.</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isFree = Number(option.amount) === 0
          const priceRs = Number(option.amount) / 100
          const isSelected = selectedOption === option.id

          return (
            <label
              key={option.id}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'border-tan bg-tan/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="shipping_option"
                value={option.id}
                checked={isSelected}
                onChange={() => setSelectedOption(option.id)}
                className="w-4 h-4 text-tan focus:ring-tan"
              />
              <Truck className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-tan' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{option.name}</p>
                {option.data?.estimated_days && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Estimated delivery: {option.data.estimated_days} business days
                  </p>
                )}
              </div>
              <div className="text-right">
                {isFree ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  <span className="font-semibold">{'\u20B9'}{priceRs.toLocaleString('en-IN')}</span>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-[2]"
          disabled={!selectedOption || loading}
        >
          {loading ? 'Saving...' : 'Continue to Payment'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </form>
  )
}

export default ShippingStep
