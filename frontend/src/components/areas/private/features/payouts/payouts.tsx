import React from 'react'
import { Container } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from '../../../../design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutsTable from './payouts-table'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'

const Payouts = ({ payouts, balance, fetchAccountBalance, searchPayout, user }) => {
  const { data, completed } = balance || {}
  const available = data?.available || [{ amount: 0, currency: 'USD' }]

  React.useEffect(() => {
    searchPayout()
    fetchAccountBalance()
  }, [searchPayout, fetchAccountBalance])

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <ProfileHeader
          title={<FormattedMessage id="payouts.title" defaultMessage="Payouts" />}
          subtitle={<FormattedMessage id="payouts.subtitle" defaultMessage="Manage your payouts on the way to your bank account" />}
        />

      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <BalanceCard
          name={<FormattedMessage id="payouts.balance" defaultMessage="Balance" />}
          balance={available[0].amount}
          currency={available[0].currency}
          onAdd={(e) => {}}
          action={<FormattedMessage id="payouts.requestPayout" defaultMessage="Request payout" />}
        />
      </div>
      <PayoutsTable payouts={payouts} />
    </Container>
  )
}

export default Payouts