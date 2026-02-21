import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /store/razorpay
 * Updates the payment session data with Razorpay payment confirmation,
 * then the frontend can call cart.complete() to finalize.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const {
    payment_session_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body as Record<string, string>

  if (!payment_session_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({
      message: "Missing required fields: payment_session_id, razorpay_order_id, razorpay_payment_id, razorpay_signature",
    })
    return
  }

  try {
    const paymentModule = req.scope.resolve(Modules.PAYMENT)

    // Retrieve existing session to get amount and currency
    const session = await paymentModule.retrievePaymentSession(payment_session_id)

    await paymentModule.updatePaymentSession({
      id: payment_session_id,
      amount: session.amount,
      currency_code: session.currency_code,
      data: {
        ...session.data,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    })

    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to update payment session",
    })
  }
}
