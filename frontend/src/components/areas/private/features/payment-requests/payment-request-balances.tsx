import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { useHistory } from 'react-router-dom'

import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'

import {
  paymentRequestBalancesMetadata,
  paymentRequestBalancesCustomColumnRenderer
} from './payment-requests-balance-table'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { Shield } from '@mui/icons-material'

const PaymentRequestBalances = ({
  user,
  account,
  paymentRequestBalances,
  fetchAccount,
  listPaymentRequestBalances
}) => {
  const history = useHistory()

  const handleGoToPayoutSettings = () => history.push('/profile/payout-settings')

  useEffect(() => {
    fetchAccount?.()
    listPaymentRequestBalances()
  }, [])

  const transactions = {
    completed: paymentRequestBalances?.completed,
    data: paymentRequestBalances?.data?.[0]?.PaymentRequestBalanceTransactions || []
  }

  const dueAmount = parseInt(paymentRequestBalances?.data?.[0]?.balance) * -1 || 0

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <AccountRequirements user={user} account={account} onClick={handleGoToPayoutSettings} />
      </Box>
      <PrimaryDataPage
        title={
          <FormattedMessage
            id="payment.request.balances.transactions.tab.label"
            defaultMessage="Disputes and refunds fees"
          />
        }
        description={
          <FormattedMessage
            id="account.profile.paymentRequests.balances.description"
            defaultMessage="Here you can see dispute and refund-related fees for your payment requests"
          />
        }
        cards={[
          {
            title: (
              <FormattedMessage
                id="payment.request.balances.card.title"
                defaultMessage="Disputes and refunds due"
              />
            ),
            amount: dueAmount,
            type: 'centavos'
          }
        ]}
        table={{
          tableData: transactions,
          tableHeaderMetadata: paymentRequestBalancesMetadata,
          customColumnRenderer: paymentRequestBalancesCustomColumnRenderer
        }}
        emptyComponent={
          <EmptyBase
            icon={<Shield />}
            text={
              <FormattedMessage
                id="payment.request.balances.empty.title"
                defaultMessage="No disputes or refunds fees"
              />
            }
            secondaryText={
              <FormattedMessage
                id="payment.request.balances.empty.description"
                defaultMessage="You don't have any disputes or refunds fees for your payment requests"
              />
            }
          />
        }
      />
    </>
  )
}

export default PaymentRequestBalances
