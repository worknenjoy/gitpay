import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import SectionDivider from 'design-library/molecules/content/section-divider/section-divider'
import PaymentLinksList, {
  PaymentLink
} from 'design-library/molecules/lists/payment-links-list/payment-links-list'

// The payment-links content on its own, without the profile header — reused
// as-is both by the standalone Service Provider page and by the Service
// provider tab of the combined multi-role profile.
export type ServiceProviderProfileBodyProps = {
  paymentLinks?: PaymentLink[]
  completed?: boolean
  onPayLink?: (link: PaymentLink) => void
}

const messages = defineMessages({
  paymentLinksTitle: {
    id: 'profile.provider.paymentLinksTitle',
    defaultMessage: 'Payment links'
  }
})

const ServiceProviderProfileBody = ({
  paymentLinks,
  completed = true,
  onPayLink
}: ServiceProviderProfileBodyProps) => {
  const intl = useIntl()

  return (
    <>
      <SectionDivider label={intl.formatMessage(messages.paymentLinksTitle)} />
      <PaymentLinksList
        links={paymentLinks ?? []}
        completed={completed}
        onPay={(link) => onPayLink?.(link)}
      />
    </>
  )
}

export default ServiceProviderProfileBody
