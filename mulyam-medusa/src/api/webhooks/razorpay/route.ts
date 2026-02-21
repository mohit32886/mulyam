import * as crypto from "crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { RazorpayWebhookEvent } from "../../../modules/razorpay/types"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    res.status(500).json({ error: "Webhook secret not configured" })
    return
  }

  const signature = req.headers["x-razorpay-signature"] as string

  if (!signature) {
    res.status(400).json({ error: "Missing signature header" })
    return
  }

  // Verify the webhook signature
  const body = JSON.stringify(req.body)
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex")

  if (expectedSignature !== signature) {
    res.status(400).json({ error: "Invalid signature" })
    return
  }

  const event = req.body as RazorpayWebhookEvent

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload.payment?.entity
      if (payment) {
        logger.info(
          `Razorpay webhook: payment.captured - ${payment.id}, amount: ${payment.amount}, order: ${payment.order_id}`
        )
      }
      break
    }

    case "payment.failed": {
      const payment = event.payload.payment?.entity
      if (payment) {
        logger.warn(
          `Razorpay webhook: payment.failed - ${payment.id}, order: ${payment.order_id}`
        )
      }
      break
    }

    case "refund.created": {
      const refund = event.payload.refund?.entity
      if (refund) {
        logger.info(
          `Razorpay webhook: refund.created - ${refund.id}, amount: ${refund.amount}, payment: ${refund.payment_id}`
        )
      }
      break
    }

    default:
      logger.warn(`Razorpay webhook: unhandled event - ${event.event}`)
  }

  res.status(200).json({ received: true })
}
