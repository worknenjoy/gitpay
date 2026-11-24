import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import ListCardRow from 'design-library/molecules/cards/list-card/list-card-row'
import AvatarStack from 'design-library/atoms/data-display/avatar-stack/avatar-stack'
import VerifiedBadge from 'design-library/atoms/badges/verified-badge/verified-badge'
import BountyPaymentStatus, {
  BountyPaymentStatusValue
} from 'design-library/atoms/status/payment-types-status/bounty-payment-status/bounty-payment-status'
import { List, Name, RepChips, RepChip } from './bounty-payments-list.styles'

export type BountyPaymentSponsor = {
  name: string
  avatarUrl?: string
  anonymous?: boolean
  verified?: boolean
  /** Sponsor history on Gitpay. Omit when not available → no chips. */
  reputation?: { paid: number; total: string; open: number }
}

export type BountyPaymentLine = {
  id: number | string
  sponsor: BountyPaymentSponsor
  amount: number
  method: 'card' | 'invoice' | 'wallet' | 'paypal'
  state: BountyPaymentStatusValue
  date?: string
}

type BountyPaymentsListProps = {
  payments: BountyPaymentLine[]
}

const METHOD_LABEL = {
  card: <FormattedMessage id="bountyPayments.method.card" defaultMessage="Card" />,
  invoice: <FormattedMessage id="bountyPayments.method.invoice" defaultMessage="Invoice" />,
  wallet: <FormattedMessage id="bountyPayments.method.wallet" defaultMessage="Wallet" />,
  paypal: <FormattedMessage id="bountyPayments.method.paypal" defaultMessage="PayPal" />
}

/** Every payment that makes up a bounty, with who paid, how, and its state. */
const BountyPaymentsList = ({ payments }: BountyPaymentsListProps) => {
  if (!payments || payments.length === 0) return null
  return (
    <List>
      {payments.map((payment) => {
        const { sponsor } = payment
        const rep = sponsor.reputation
        return (
          <ListCardRow
            key={payment.id}
            leading={<AvatarStack people={[sponsor]} withTooltip={false} />}
            title={
              <Name>
                {sponsor.anonymous ? (
                  <FormattedMessage id="bountyPayments.anonymous" defaultMessage="Anonymous" />
                ) : (
                  sponsor.name
                )}
                {sponsor.verified && <VerifiedBadge size="small" />}
              </Name>
            }
            meta={[
              METHOD_LABEL[payment.method],
              payment.date && <FormattedDate value={payment.date} month="short" day="numeric" />
            ]}
            extra={
              sponsor.anonymous ? null : rep ? (
                <RepChips>
                  <RepChip>
                    <b>{rep.paid}</b>{' '}
                    <FormattedMessage id="bountyPayments.rep.paid" defaultMessage="paid" />
                  </RepChip>
                  <RepChip>
                    <b>{rep.total}</b>{' '}
                    <FormattedMessage id="bountyPayments.rep.total" defaultMessage="total" />
                  </RepChip>
                  <RepChip>
                    <b>{rep.open}</b>{' '}
                    <FormattedMessage id="bountyPayments.rep.open" defaultMessage="open" />
                  </RepChip>
                </RepChips>
              ) : null
            }
            status={<BountyPaymentStatus status={payment.state} />}
            currency="$"
            amount={payment.amount.toFixed(2)}
          />
        )
      })}
    </List>
  )
}

export default BountyPaymentsList
