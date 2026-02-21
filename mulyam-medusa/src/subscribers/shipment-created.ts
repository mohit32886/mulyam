import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function shipmentCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; fulfillment_id: string; order_id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { order_id, fulfillment_id } = event.data

  try {
    // Fetch the order
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: order_id },
    })

    if (!order || !order.email) {
      logger.warn(`Order ${order_id} not found or missing email, skipping shipping notification`)
      return
    }

    // Try to get fulfillment details for tracking info
    let trackingNumber = ""
    let trackingUrl = ""
    try {
      const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
      const fulfillment = await fulfillmentModule.retrieveFulfillment(fulfillment_id)
      if (fulfillment?.tracking_links?.length) {
        trackingNumber = fulfillment.tracking_links[0].tracking_number || ""
        trackingUrl = fulfillment.tracking_links[0].url || ""
      }
    } catch {
      // Tracking info is optional
    }

    const address = order.shipping_address
    const items = order.items || []

    const itemsList = items
      .map(
        (item: any) =>
          `<li style="padding: 8px 0; color: #333; font-size: 14px;">${item.title || item.product_title || "Item"} × ${item.quantity}</li>`
      )
      .join("")

    const trackingHtml = trackingNumber
      ? `
        <div style="background: #f0ebe4; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 8px 0;">Tracking Number</p>
          <p style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin: 0; font-family: monospace;">
            ${trackingUrl ? `<a href="${trackingUrl}" style="color: #d4a574; text-decoration: none;">${trackingNumber}</a>` : trackingNumber}
          </p>
        </div>`
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

    <!-- Shipping Card -->
    <div style="background: #ffffff; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 12px;">📦</div>
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #1a1a1a; margin: 0 0 8px 0;">
          Your Order Has Shipped!
        </h2>
        <p style="color: #666; font-size: 14px; margin: 0;">
          Great news! Your order #${order.display_id || order_id.slice(-8)} is on its way.
        </p>
      </div>

      ${trackingHtml}

      <!-- Items -->
      <div style="margin-top: 20px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 8px 0;">
          Items Shipped
        </h3>
        <ul style="list-style: none; padding: 0; margin: 0; border-top: 1px solid #f0ebe4;">
          ${itemsList}
        </ul>
      </div>

      ${
        address
          ? `
      <!-- Delivery Address -->
      <div style="margin-top: 20px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 8px 0;">
          Delivering To
        </h3>
        <p style="margin: 0; color: #333; font-size: 14px;">
          ${address.first_name || ""} ${address.last_name || ""}<br/>
          ${address.address_1 || ""}${address.address_2 ? `, ${address.address_2}` : ""}<br/>
          ${address.city || ""}, ${address.province || ""} - ${address.postal_code || ""}
        </p>
      </div>`
          : ""
      }
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 16px;">
      <p style="font-size: 13px; color: #999; margin: 0 0 8px 0;">
        Questions about your delivery? Reach us on WhatsApp at +91 95238 82449
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
      template: "shipment-notification",
      content: {
        subject: `Your Order Has Shipped - #${order.display_id || order_id.slice(-8)} | Mulyam Jewels`,
        html,
      },
    })

    logger.info(`Shipping notification sent for order ${order_id} to ${order.email}`)
  } catch (err: any) {
    logger.error(`Failed to send shipping notification for ${order_id}: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
  context: {
    subscriberId: "shipment-created-notification",
  },
}
