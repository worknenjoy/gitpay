import React from 'react'
import DashboardCardBase from '../dashboard-card-base/dashboard-card-base'
import { FormattedMessage } from 'react-intl'
import { Chip } from '@mui/material'
import { DashboardCardChipList } from './bank-account-dashboard-card.styles'
import bankAccountIcon from 'images/icons/noun_project management_3063515.svg'

const BankAccountDashboardCard = ({ accounts = 0, verified = 0, pending = 0 }) => {
  return (
    <DashboardCardBase
      image={bankAccountIcon}
      title={
        <FormattedMessage
          id="account.profile.bankAccounts.headline"
          defaultMessage="Bank Accounts"
        />
      }
      subheader={
        <FormattedMessage
          id="account.profile.bankAccounts.overview"
          defaultMessage="{accounts} bank accounts linked"
          values={{ accounts }}
        />
      }
      buttonText={
        <FormattedMessage
          id="account.profile.bankAccounts.buttonText"
          defaultMessage="Manage bank accounts"
        />
      }
      buttonLink="/profile/payout-settings/bank-account/bank-account-info"
    >
      <DashboardCardChipList>
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.bankAccounts.chip.verified"
              defaultMessage="{verified} verified"
              values={{ verified }}
            />
          }
          color="primary"
        />
        <Chip
          size="small"
          label={
            <FormattedMessage
              id="account.profile.bankAccounts.chip.pending"
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

export default BankAccountDashboardCard
