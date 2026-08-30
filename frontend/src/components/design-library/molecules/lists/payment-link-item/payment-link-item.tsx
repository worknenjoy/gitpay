import React from 'react'
import { FormattedMessage } from 'react-intl'
import CopyIconButton from 'design-library/atoms/buttons/copy-icon-button/copy-icon-button'
import Button from 'design-library/atoms/buttons/button/button'
import {
  Root,
  Info,
  Title,
  UrlRow,
  UrlText,
  Meta,
  Price,
  PaidCount
} from './payment-link-item.styles'

export type PaymentLink = {
  id: number | string
  title: React.ReactNode
  currency?: string
  amount?: string | number | null
  payment_url?: string | null
  paidCount?: number
}

type PaymentLinkItemProps = {
  link: PaymentLink
  onPay?: (link: PaymentLink) => void
}

const PaymentLinkItem = ({ link, onPay }: PaymentLinkItemProps) => (
  <Root>
    <Info>
      <Title variant="body1">{link.title}</Title>
      {link.payment_url && (
        <UrlRow>
          <UrlText>{link.payment_url.replace(/^https?:\/\//, '')}</UrlText>
          <CopyIconButton value={link.payment_url} />
        </UrlRow>
      )}
    </Info>
    <Meta>
      {link.amount != null && (
        <div>
          <Price variant="body1">
            {(link.currency || 'USD').toUpperCase() === 'USD' ? '$' : ''}
            {link.amount}
          </Price>
          <PaidCount>{(link.currency || 'USD').toUpperCase()}</PaidCount>
        </div>
      )}
      {link.paidCount != null && (
        <div>
          <Price variant="body1">{link.paidCount}</Price>
          <PaidCount>
            <FormattedMessage id="paymentLinkItem.paid" defaultMessage="paid" />
          </PaidCount>
        </div>
      )}
      {onPay && (
        <Button variant="contained" color="secondary" size="small" onClick={() => onPay(link)}>
          <FormattedMessage id="paymentLinkItem.pay" defaultMessage="Pay" />
        </Button>
      )}
    </Meta>
  </Root>
)

export default PaymentLinkItem
