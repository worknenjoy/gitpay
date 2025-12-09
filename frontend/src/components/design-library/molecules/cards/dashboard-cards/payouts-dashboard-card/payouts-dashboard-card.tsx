import React from 'react'
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base'
import { FormattedMessage } from 'react-intl'
import { Chip } from '@mui/material'
import { DashboardCardChipList } from './payouts-dashboard-card.styles'
import payoutIcon from 'images/icons/noun_project management_3063542.svg'
import { formatCurrency } from '../../../../../../utils/format-currency'
import { formatStripeAmount } from '../../balance-card/balance-card'

const PayoutsDashboardCard = ({ payouts }) => {
  const { currency, amount, total = 0, pending = 0, completed = 0, in_transit = 0 } = payouts || {}
  const convertedAmount = formatStripeAmount(amount)
  const finalAmount = formatCurrency(Number(convertedAmount), 'en-US', currency.toUpperCase())
  return (
    <DashboardCardBase
      image={payoutIcon}
      title={
        <FormattedMessage
          id="account.profile.payouts.headline"
          defaultMessage="Payouts in {currency}"
          values={{ currency: currency.toUpperCase() }}
        />
      }
      subheader={
        <>
          <FormattedMessage
            id="account.profile.payouts.overview"
            defaultMessage="{total} payouts"
            values={{ total }}
          />
          <br />
          <FormattedMessage
            id="account.profile.payouts.amount"
            defaultMessage="{amount} in payouts"
            values={{ amount: finalAmount }}
          />
        </>
      }
      buttonText={
        <FormattedMessage id="account.profile.payouts.buttonText" defaultMessage="See payouts" />
      }
      buttonLink="/profile/payouts"
    >
      <DashboardCardChipList>
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.payouts.chip.completed"
              defaultMessage="{completed} paid"
              values={{ completed }}
            />
          }
          color="success"
        />
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.payouts.chip.in_transit"
              defaultMessage="{in_transit} in transit"
              values={{ in_transit }}
            />
          }
          color="info"
        />
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.payouts.chip.pending"
              defaultMessage="{pending} pending"
              values={{ pending }}
            />
          }
          color="warning"
        />
      </DashboardCardChipList>
    </DashboardCardBase>
  )
}

export default PayoutsDashboardCard
