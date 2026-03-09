import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { useHistory } from 'react-router-dom'

import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'

import { paymentRequestPaymentsMetadata } from './payment-requests-payments-table'
import { usePaymentRequestPaymentsCustomColumnRenderer } from './hooks/usePaymentRequestPaymentColumnRender'

const PaymentRequestPayments = ({
  user,
  account,
  paymentRequestPayments,
  fetchAccount,
  listPaymentRequestPayments,
  refundPaymentRequestPayment
}) => {
  const history = useHistory()

  const handleGoToPayoutSettings = () => history.push('/profile/payout-settings')

  const paymentRequestPaymentsCustomColumnRenderer = usePaymentRequestPaymentsCustomColumnRenderer({
    onRefund: async (paymentId) => {
      await refundPaymentRequestPayment(paymentId)
      await listPaymentRequestPayments()
    }
  })

  useEffect(() => {
    fetchAccount?.()
    listPaymentRequestPayments()
  }, [])

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <AccountRequirements user={user} account={account} onClick={handleGoToPayoutSettings} />
      </Box>
      <PrimaryDataPage
        title={
          <FormattedMessage
            id="payment.request.payments.tab.label"
            defaultMessage="Payments for payment requests"
          />
        }
        description={
          <FormattedMessage
            id="account.profile.paymentRequests.payments.description"
            defaultMessage="Here you can see all payments received via your payment request links"
          />
        }
        table={{
          tableData: paymentRequestPayments,
          tableHeaderMetadata: paymentRequestPaymentsMetadata,
          customColumnRenderer: paymentRequestPaymentsCustomColumnRenderer
        }}
      />
    </>
  )
}

export default PaymentRequestPayments
