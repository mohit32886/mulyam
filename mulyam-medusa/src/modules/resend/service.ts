import { Resend } from "resend"
import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import type { Logger, NotificationTypes } from "@medusajs/framework/types"
import type { ResendOptions } from "./types"

type InjectedDependencies = {
  logger: Logger
}

class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  protected resend_: Resend
  protected from_: string
  protected logger_: Logger

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()

    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend api_key is required in the provider's options."
      )
    }

    this.logger_ = logger
    this.from_ = options.from || "Mulyam Jewels <noreply@mulyamjewels.com>"
    this.resend_ = new Resend(options.api_key)
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No notification information provided"
      )
    }

    const from = notification.from?.trim() || this.from_
    const content = notification.content || (notification as any).data || {}
    const subject = content.subject || notification.template || "Mulyam Jewels"
    const html = content.html || ""

    try {
      const { data, error } = await this.resend_.emails.send({
        from,
        to: notification.to,
        subject,
        html,
      })

      if (error) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Resend error: ${error.message}`
        )
      }

      this.logger_.info(`Email sent to ${notification.to} via Resend (id: ${data?.id})`)

      return { id: data?.id }
    } catch (error: any) {
      this.logger_.error(`Failed to send email via Resend: ${error.message}`)
      throw error
    }
  }
}

export default ResendNotificationService
