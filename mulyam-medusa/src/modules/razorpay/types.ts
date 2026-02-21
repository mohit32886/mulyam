export interface RazorpayOptions {
  key_id: string
  key_secret: string
}

export interface RazorpayPaymentSessionData {
  razorpay_order_id: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  key_id: string
  amount: number
  currency: string
}

export interface RazorpayWebhookEvent {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment?: {
      entity: {
        id: string
        amount: number
        currency: string
        status: string
        order_id: string
        method: string
        description: string | null
        notes: Record<string, string>
      }
    }
    refund?: {
      entity: {
        id: string
        amount: number
        currency: string
        payment_id: string
        notes: Record<string, string>
      }
    }
  }
  created_at: number
}
