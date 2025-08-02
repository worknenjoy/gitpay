import React from 'react'
import { Box, Container, Paper } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from '../../../../design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutsTable from './payouts-table'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import EmptyPayout from 'design-library/molecules/content/empty/empty-payout/empty-payout'
import { useHistory } from 'react-router-dom'
import PayoutRequestDrawer from 'design-library/molecules/drawers/payout-request-drawer/payout-request-drawer'

const Payouts = ({ payouts, balance, fetchAccountBalance, searchPayout, requestPayout, user }) => {
  const history = useHistory()
  const { data: userData, completed: userCompleted } = user || {}
  const { data, completed } = balance || {}
  const available = data?.available || [{ amount: 0, currency: 'USD' }]

  const [ payoutRequestDrawer, setPayoutRequestDrawer ] = React.useState(false)

  const handlePayoutRequestDrawer = () => {
    setPayoutRequestDrawer(!payoutRequestDrawer)
  }

  const handlePayoutRequestForm = async (e, data) => {
    await requestPayout(data)
    await searchPayout()
    await fetchAccountBalance()
    setPayoutRequestDrawer(false)
  }

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
      {(!userData?.account_id && userCompleted) ? (
        <Paper elevation={0} style={{ padding: 20, marginTop: 10 }}>
          <EmptyPayout
            onActionClick={() => history.push('/profile/payout-settings')}
          />
        </Paper>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            {available.map((item, index) => (
             <>
                <BalanceCard
                  key={index}
                  name={<FormattedMessage id="payouts.balance" defaultMessage="Balance" />}
                  balance={item.amount}
                  currency={item.currency}
                  onAdd={handlePayoutRequestDrawer}
                  action={<FormattedMessage id="payouts.requestPayout" defaultMessage="Request payout" />}
                  actionProps={{ disabled: item.amount === 0 }}
                  completed={completed}
                />
                <PayoutRequestDrawer
                  open={payoutRequestDrawer}
                  onClose={handlePayoutRequestDrawer}
                  balance={item.amount}
                  currency={item.currency}
                  completed={completed}
                  onSuccess={handlePayoutRequestForm}
                />
              </>
            ))}
          </div>
          <PayoutsTable payouts={payouts} />
        </>
      )}
    </Container>
  )
}

export default Payouts