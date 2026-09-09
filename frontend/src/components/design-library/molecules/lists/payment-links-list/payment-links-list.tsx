import React from 'react'
import { Typography } from '@mui/material'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import CopyIconButton from 'design-library/atoms/buttons/copy-icon-button/copy-icon-button'
import Button from 'design-library/atoms/buttons/button/button'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { DataObject as EmptyIcon } from '@mui/icons-material'
import { Row, UrlRow } from './payment-links-list.styles'
import PaymentLinksListPlaceholder from './payment-links-list.placeholder'

export type PaymentLink = {
  id: string | number
  title: string
  /** Same field payment requests already carry — shown under the title, when present. */
  description?: string
  url: string
  price: number
  currency?: string
  paidCount: number
}

export type PaymentLinksListProps = {
  links: PaymentLink[]
  completed?: boolean
  onPay: (link: PaymentLink) => void
}

const messages = defineMessages({
  empty: {
    id: 'profile.paymentLinks.empty',
    defaultMessage: 'No payment links yet'
  },
  pay: {
    id: 'profile.paymentLinks.pay',
    defaultMessage: 'Pay'
  }
})

const PaymentLinksList = ({ links, completed = true, onPay }: PaymentLinksListProps) => {
  const intl = useIntl()

  if (!completed) {
    return <PaymentLinksListPlaceholder />
  }

  if (links.length === 0) {
    return <EmptyBase icon={<EmptyIcon />} text={intl.formatMessage(messages.empty)} />
  }

  return (
    <>
      {links.map((link) => (
        <Row key={link.id}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
              {link.title}
            </Typography>
            {link.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {link.description}
              </Typography>
            )}
            <UrlRow>
              <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace' }}>
                {link.url}
              </Typography>
              <CopyIconButton value={link.url} />
            </UrlRow>
          </div>
          <div>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 13.5, textAlign: 'right' }}>
              ${link.price}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: 'monospace', display: 'block', textAlign: 'right' }}
            >
              {link.currency ?? 'USD'}
            </Typography>
          </div>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: 'monospace', textAlign: 'right' }}
          >
            <FormattedMessage
              id="profile.paymentLinks.paidCount"
              defaultMessage="{count} paid"
              values={{
                count: (
                  <Typography component="b" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {link.paidCount}
                  </Typography>
                )
              }}
            />
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onPay(link)}
            label={intl.formatMessage(messages.pay)}
          />
        </Row>
      ))}
    </>
  )
}

export default PaymentLinksList
