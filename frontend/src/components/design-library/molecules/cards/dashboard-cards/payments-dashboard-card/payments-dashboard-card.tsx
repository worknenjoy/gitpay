import React from 'react'
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base'
import { FormattedMessage } from 'react-intl'
import { Chip } from '@mui/material'
import { DashboardCardChipList } from './payments-dashboard-card.styles'
import paymentIcon from 'images/icons/noun_project management_3063535.svg'
import { formatCurrency } from '../../../../../../utils/format-currency'

const PaymentsDashboardCard = ({ payments }) => {
  const {
    total = 0,
    succeeded = 0,
    pending = 0,
    failed = 0,
    refunded = 0,
    amount = 0
  } = payments || {}
  return (
    <DashboardCardBase
      image={paymentIcon}
      title={<FormattedMessage id="account.profile.payments.headline" defaultMessage="Payments" />}
      subheader={
        <>
          <FormattedMessage
            id="account.profile.payments.overview"
            defaultMessage="{total} payments processed"
            values={{ total }}
          />
          <br />
          <FormattedMessage
            id="account.profile.payments.amount"
            defaultMessage="{amount} paid"
            values={{ amount: formatCurrency(amount) }}
          />
        </>
      }
      buttonText={
        <FormattedMessage
          id="account.profile.payments.buttonText"
          defaultMessage="See your payments"
        />
      }
      buttonLink="/profile/payments"
    >
      <div>
        <DashboardCardChipList>
          <Chip
            size="small"
            label={
              <FormattedMessage
                id="account.profile.payments.chip.succeeded"
                defaultMessage="{succeeded} paid"
                values={{ succeeded }}
              />
            }
            sx={{ bgcolor: '#DCFCE7', color: '#166534' }}
          />
          <Chip
            size="small"
            label={
              <FormattedMessage
                id="account.profile.payments.chip.pending"
                defaultMessage="{pending} pending"
                values={{ pending }}
              />
            }
            sx={{ bgcolor: '#FEF3C7', color: '#92400E' }}
          />
          <Chip
            size="small"
            label={
              <FormattedMessage
                id="account.profile.payments.chip.failed"
                defaultMessage="{failed} failed"
                values={{ failed }}
              />
            }
            sx={{ bgcolor: '#FFE4E6', color: '#9F1239' }}
          />
          <Chip
            size="small"
            label={
              <FormattedMessage
                id="account.profile.payments.chip.refunded"
                defaultMessage="{refunded} refunded"
                values={{ refunded: refunded }}
              />
            }
            sx={{ bgcolor: '#E0E7FF', color: '#3730A3' }}
          />
        </DashboardCardChipList>
      </div>
    </DashboardCardBase>
  )
}

export default PaymentsDashboardCard
