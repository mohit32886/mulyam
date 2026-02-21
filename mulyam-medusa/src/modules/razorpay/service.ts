import * as crypto from "crypto"
import Razorpay from "razorpay"
import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import { BigNumber } from "@medusajs/framework/utils"
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"
import type { RazorpayOptions } from "./types"

class RazorpayPaymentProviderService extends AbstractPaymentProvider<RazorpayOptions> {
  static identifier = "razorpay"

  protected razorpay_: InstanceType<typeof Razorpay>
  protected options_: RazorpayOptions

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.key_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay key_id is required in the provider's options."
      )
    }
    if (!options.key_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Razorpay key_secret is required in the provider's options."
      )
    }
  }

  constructor(container: Record<string, unknown>, options: RazorpayOptions) {
    super(container, options)

    this.options_ = options
    this.razorpay_ = new Razorpay({
      key_id: options.key_id,
      key_secret: options.key_secret,
    })
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    const order = await this.razorpay_.orders.create({
      amount: Number(amount),
      currency: currency_code.toUpperCase(),
      receipt: context?.idempotency_key || `receipt_${Date.now()}`,
    })

    return {
      id: order.id,
      data: {
        razorpay_order_id: order.id,
        key_id: this.options_.key_id,
        amount: order.amount,
        currency: order.currency,
      },
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const { data } = input

    const razorpay_order_id = data?.razorpay_order_id as string
    const razorpay_payment_id = data?.razorpay_payment_id as string
    const razorpay_signature = data?.razorpay_signature as string

    // Path 1: Frontend provided all fields (via session data update) — verify signature
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac("sha256", this.options_.key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

      if (expectedSignature !== razorpay_signature) {
        return {
          status: "error" as any,
          data: {
            ...data,
            error: "Invalid payment signature",
          },
        }
      }

      return {
        status: "authorized",
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      }
    }

    // Path 2: Verify by fetching Razorpay order status directly
    if (razorpay_order_id) {
      try {
        const order = await this.razorpay_.orders.fetch(razorpay_order_id)

        if (order.status === "paid") {
          // Get the first successful payment from the order
          const payments = await this.razorpay_.orders.fetchPayments(razorpay_order_id)
          const successPayment = (payments as any).items?.find(
            (p: any) => p.status === "captured" || p.status === "authorized"
          )

          return {
            status: "authorized",
            data: {
              razorpay_order_id,
              razorpay_payment_id: successPayment?.id || "",
              razorpay_status: order.status,
            },
          }
        }

        if (order.status === "attempted") {
          return {
            status: "pending" as any,
            data: {
              ...data,
              razorpay_status: order.status,
            },
          }
        }

        return {
          status: "error" as any,
          data: {
            ...data,
            error: `Razorpay order status: ${order.status}`,
          },
        }
      } catch (err: any) {
        return {
          status: "error" as any,
          data: {
            ...data,
            error: `Failed to verify Razorpay order: ${err.message}`,
          },
        }
      }
    }

    return {
      status: "error" as any,
      data: {
        ...data,
        error: "Missing Razorpay order ID",
      },
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // Razorpay auto-captures payments by default
    return { data: input.data }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const paymentId = input.data?.razorpay_payment_id as string

    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing razorpay_payment_id for refund"
      )
    }

    const refund = await this.razorpay_.payments.refund(paymentId, {
      amount: Number(input.amount),
    })

    return {
      data: {
        ...input.data,
        refund_id: refund.id,
        refund_amount: refund.amount,
        refund_status: refund.status,
      },
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const razorpayPaymentId = input.data?.razorpay_payment_id as
      | string
      | undefined

    if (!razorpayPaymentId) {
      return { status: "pending" }
    }

    try {
      const payment = await this.razorpay_.payments.fetch(razorpayPaymentId)

      switch (payment.status) {
        case "captured":
          return { status: "captured" }
        case "authorized":
          return { status: "authorized" }
        case "failed":
          return { status: "error" as any }
        case "refunded":
          return { status: "captured" }
        default:
          return { status: "pending" }
      }
    } catch {
      return { status: "pending" }
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const razorpayPaymentId = input.data?.razorpay_payment_id as
      | string
      | undefined

    if (!razorpayPaymentId) {
      return { data: input.data }
    }

    const payment = await this.razorpay_.payments.fetch(razorpayPaymentId)
    return {
      data: {
        ...input.data,
        razorpay_status: payment.status,
        razorpay_method: payment.method,
      },
    }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    const { amount, currency_code, context, data } = input

    // If the data already contains a Razorpay order and the amount hasn't changed,
    // just return the merged data (e.g., when adding payment confirmation fields).
    const existingAmount = data?.amount as number | undefined
    if (data?.razorpay_order_id && (!amount || Number(amount) === existingAmount)) {
      return { data: { ...data } }
    }

    // No currency or amount? Just pass through.
    if (!amount || !currency_code) {
      return { data: { ...data } }
    }

    // Amount changed — Razorpay orders can't be updated, so create a new one.
    const order = await this.razorpay_.orders.create({
      amount: Number(amount),
      currency: currency_code.toUpperCase(),
      receipt: context?.idempotency_key || `receipt_${Date.now()}`,
    })

    return {
      data: {
        ...data,
        razorpay_order_id: order.id,
        key_id: this.options_.key_id,
        amount: order.amount,
        currency: order.currency,
      },
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      return {
        action: "not_supported",
      }
    }

    // Verify webhook signature
    const signature = headers?.["x-razorpay-signature"] as string
    if (signature && rawData) {
      const body =
        typeof rawData === "string" ? rawData : JSON.stringify(rawData)
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex")

      if (expectedSignature !== signature) {
        return {
          action: "not_supported",
        }
      }
    }

    const event = data?.event as string
    const paymentEntity = (data?.payload as any)?.payment?.entity

    if (!paymentEntity) {
      return {
        action: "not_supported",
      }
    }

    const sessionId = (paymentEntity.notes?.session_id ||
      paymentEntity.order_id) as string

    switch (event) {
      case "payment.authorized":
        return {
          action: "authorized",
          data: {
            session_id: sessionId,
            amount: new BigNumber(paymentEntity.amount),
          },
        }
      case "payment.captured":
        return {
          action: "captured",
          data: {
            session_id: sessionId,
            amount: new BigNumber(paymentEntity.amount),
          },
        }
      case "payment.failed":
        return {
          action: "failed",
          data: {
            session_id: sessionId,
            amount: new BigNumber(paymentEntity.amount),
          },
        }
      default:
        return {
          action: "not_supported",
        }
    }
  }
}

export default RazorpayPaymentProviderService
