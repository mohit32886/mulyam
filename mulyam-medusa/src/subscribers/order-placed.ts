import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderModule = container.resolve(Modules.ORDER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const orderId = event.data.id

  try {
    // Fetch order with items and shipping address
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "shipping_total",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: orderId },
    })

    if (!order || !order.email) {
      logger.warn(`Order ${orderId} not found or missing email, skipping notification`)
      return
    }

    const items = order.items || []
    const address = order.shipping_address
    const total = Number(order.total || 0) / 100
    const subtotal = Number(order.subtotal || 0) / 100
    const shippingTotal = Number(order.shipping_total || 0) / 100

    const itemsHtml = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe4;">
            <div style="font-weight: 500; color: #1a1a1a;">${item.title || item.product_title || "Item"}</div>
            <div style="font-size: 13px; color: #666;">Qty: ${item.quantity}</div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe4; text-align: right; font-weight: 500;">
            ₹${(Number(item.total || item.unit_price * item.quantity) / 100).toLocaleString("en-IN")}
          </td>
        </tr>`
      )
      .join("")

    const addressHtml = address
      ? `
        <p style="margin: 0; color: #333; font-size: 14px;">
          ${address.first_name || ""} ${address.last_name || ""}<br/>
          ${address.address_1 || ""}${address.address_2 ? `, ${address.address_2}` : ""}<br/>
          ${address.city || ""}, ${address.province || ""} - ${address.postal_code || ""}<br/>
          ${address.phone ? `Phone: +91 ${address.phone}` : ""}
        </p>`
      : ""

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a1a1a; margin: 0;">
        Mulyam Jewels
      </h1>
    </div>

    <!-- Confirmation Card -->
    <div style="background: #ffffff; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 12px;">✓</div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #1a1a1a; margin: 0 0 8px 0;">
          Order Confirmed!
        </h2>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Thank you for your order. We'll send you a shipping update soon.
        </p>
        <p style="font-size: 13px; color: #999; margin: 8px 0 0 0;">
          Order #${order.display_id || orderId.slice(-8)}
        </p>
      </div>

      <!-- Items -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #d4a574; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999;">
              Item
            </th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #d4a574; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999;">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="padding-top: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 6px;">
          <span>Subtotal</span>
          <span>₹${subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 12px;">
          <span>Shipping</span>
          <span>${shippingTotal === 0 ? "Free" : `₹${shippingTotal.toLocaleString("en-IN")}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 600; color: #1a1a1a; border-top: 2px solid #d4a574; padding-top: 12px;">
          <span>Total Paid</span>
          <span>₹${total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    ${
      address
        ? `
    <!-- Shipping Address -->
    <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 12px 0;">
        Delivering To
      </h3>
      ${addressHtml}
    </div>`
        : ""
    }

    <!-- Footer -->
    <div style="text-align: center; padding-top: 16px;">
      <p style="font-size: 13px; color: #999; margin: 0 0 8px 0;">
        Questions? Reach us on WhatsApp at +91 95238 82449
      </p>
      <p style="font-size: 12px; color: #ccc; margin: 0;">
        © ${new Date().getFullYear()} Mulyam Jewels. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`

    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-confirmation",
      content: {
        subject: `Order Confirmed - #${order.display_id || orderId.slice(-8)} | Mulyam Jewels`,
        html,
      },
    })

    logger.info(`Order confirmation email sent for order ${orderId} to ${order.email}`)
  } catch (err: any) {
    logger.error(`Failed to send order confirmation for ${orderId}: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-placed-notification",
  },
}
