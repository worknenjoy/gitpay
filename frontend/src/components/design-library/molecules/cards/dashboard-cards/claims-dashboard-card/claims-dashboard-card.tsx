import React from 'react'
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base'
import { FormattedMessage } from 'react-intl'
import { Chip } from '@mui/material'
import { DashboardCardChipList } from './claims-dashboard-card.styles'
import claimIcon from 'images/icons/noun_project management_3063514.svg'
import { formatCurrency } from '../../../../../../utils/format-currency'

const ClaimsDashboardCard = ({ claims }) => {
  const { total = 0, amount = 0 } = claims || {}
  return (
    <DashboardCardBase
      image={claimIcon}
      title={<FormattedMessage id="account.profile.claims.headline" defaultMessage="Claims" />}
      subheader={
        <FormattedMessage
          id="account.profile.claims.overview"
          defaultMessage="{total} claim(s)"
          values={{ total }}
        />
      }
      buttonText={
        <FormattedMessage id="account.profile.claims.buttonText" defaultMessage="View claims" />
      }
      buttonLink="/profile/claims"
    >
      <DashboardCardChipList>
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.claims.chip.amount"
              defaultMessage="{amount} claimed"
              values={{ amount: formatCurrency(amount) }}
            />
          }
          color="info"
        />
      </DashboardCardChipList>
    </DashboardCardBase>
  )
}

export default ClaimsDashboardCard
