import React from 'react'
import { Container, Paper, useMediaQuery, useTheme } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ProfileHeader from '../../../../design-library/molecules/headers/profile-main-header/profile-main-header'
import PayoutsTable from './payouts-table'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import StatusCard from 'design-library/molecules/cards/status-card/status-card'
import EmptyPayout from 'design-library/molecules/content/empty/empty-payout/empty-payout'
import { useHistory } from 'react-router-dom'
import PayoutRequestDrawer from 'design-library/molecules/drawers/payout-request-drawer/payout-request-drawer'

const Payouts = ({
  payouts,
  balance,
  fetchAccountBalance,
  searchPayout,
  requestPayout,
  user,
  account,
  fetchAccount
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const history = useHistory()
  const { data: userData, completed: userCompleted } = user || {}
  const { data, completed } = balance || {}
  const available = data?.available || [{ amount: 0, currency: 'USD' }]
  const { data: accountData, completed: accountCompleted } = account || {}
  const payoutSchedule = accountData?.settings?.payouts?.schedule?.interval

  const [payoutRequestDrawer, setPayoutRequestDrawer] = React.useState(false)

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
    fetchAccount()
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
          subtitle={
            <FormattedMessage
              id="payouts.subtitle"
              defaultMessage="Manage your payouts on the way to your bank account"
            />
          }
        />
      </div>
      {!userData?.account_id && userCompleted ? (
        <Paper elevation={0} style={{ padding: 20, marginTop: 10 }}>
          <EmptyPayout onActionClick={() => history.push('/profile/payout-settings')} />
        </Paper>
      ) : (
        <>
          <div
            style={
              isMobile
                ? { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }
                : { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }
            }
          >
            <StatusCard
              name={<FormattedMessage id="payouts.schedule" defaultMessage="Payout Schedule" />}
              status={payoutSchedule || 'No Info'}
              onAdd={() => history.push('/profile/payout-settings/bank-account/payout-schedule')}
              action={
                <FormattedMessage
                  id="payouts.editSchedule"
                  defaultMessage="Change payout schedule"
                />
              }
              actionProps={{ disabled: !accountCompleted }}
              completed={accountCompleted}
            />
            {available.map((item, index) => (
              <>
                <BalanceCard
                  key={index}
                  name={<FormattedMessage id="payouts.balance" defaultMessage="Balance" />}
                  balance={item.amount}
                  currency={item.currency}
                  onAdd={handlePayoutRequestDrawer}
                  action={
                    <FormattedMessage id="payouts.requestPayout" defaultMessage="Request payout" />
                  }
                  actionProps={{ disabled: item.amount === 0 || payoutSchedule !== 'manual' }}
                  completed={completed}
                  type="centavos"
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
