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
import Button from 'design-library/atoms/buttons/button/button'
import { SettingsOutlined as SettingsIcon } from '@mui/icons-material'

const paymentProvider = () =>
  (typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER) || 'stripe'

const hasPayoutAccount = (userData: any) => {
  if (paymentProvider() === 'whop') {
    return Boolean(userData?.whop_account_id)
  }
  return Boolean(userData?.account_id)
}

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
  const available = data?.available?.length ? data.available : [{ amount: 0, currency: 'usd' }]
  const { data: accountData, completed: accountCompleted } = account || {}
  const isWhop = paymentProvider() === 'whop' || accountData?.provider === 'whop'
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
  }, [searchPayout, fetchAccountBalance, fetchAccount])

  // Stripe: only enable request when schedule is manual (auto schedule pays without request).
  // Whop: no Connect schedule — withdrawals are always on-demand.
  const canRequestPayout = (amount: number) => {
    if (amount <= 0) return false
    if (isWhop) return true
    return payoutSchedule === 'manual'
  }

  return (
    <Container>
      <ProfileHeader
        title={<FormattedMessage id="payouts.title" defaultMessage="Payouts" />}
        subtitle={
          isWhop ? (
            <FormattedMessage
              id="payouts.subtitle.whop"
              defaultMessage="Request a withdrawal from your Whop connected company balance to your bank or payout method"
            />
          ) : (
            <FormattedMessage
              id="payouts.subtitle"
              defaultMessage="Manage your payouts on the way to your bank account"
            />
          )
        }
        aside={
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            endIcon={<SettingsIcon fontSize="small" />}
            onClick={() => history.push('/profile/payout-settings')}
            sx={{
              marginTop: { xs: 2, sm: 0 },
              height: 28,
              minHeight: 28,
              py: 0,
              px: 1
            }}
          >
            Payout settings
          </Button>
        }
      />
      {!hasPayoutAccount(userData) && userCompleted ? (
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
            {!isWhop && (
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
            )}
            {isWhop && (
              <StatusCard
                name={<FormattedMessage id="payouts.method.whop" defaultMessage="Payout method" />}
                status={
                  accountData?.payout_method?.label ||
                  accountData?.payout_methods?.find((method) => method?.default)?.label ||
                  accountData?.payout_methods?.[0]?.label ||
                  (accountData?.payout_methods?.length ? 'Managed on Whop' : 'Managed on Whop')
                }
                onAdd={() => history.push('/profile/payout-settings/whop/payout-method')}
                action={
                  <FormattedMessage
                    id="payouts.method.whop.manage"
                    defaultMessage="Manage on Whop"
                  />
                }
                actionProps={{ disabled: !accountCompleted }}
                completed={accountCompleted}
              />
            )}
            {available.map((item, index) => (
              <React.Fragment key={index}>
                <BalanceCard
                  name={<FormattedMessage id="payouts.balance" defaultMessage="Balance" />}
                  balance={item.amount}
                  currency={item.currency}
                  onAdd={handlePayoutRequestDrawer}
                  action={
                    <FormattedMessage id="payouts.requestPayout" defaultMessage="Request payout" />
                  }
                  actionProps={{ disabled: !canRequestPayout(item.amount) }}
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
              </React.Fragment>
            ))}
          </div>
          <PayoutsTable payouts={payouts} />
        </>
      )}
    </Container>
  )
}

export default Payouts
