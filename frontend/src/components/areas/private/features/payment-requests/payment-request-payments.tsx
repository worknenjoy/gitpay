import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { useHistory } from 'react-router-dom'

import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'

import { paymentRequestPaymentsMetadata } from './payment-requests-payments-table'
import { usePaymentRequestPaymentsCustomColumnRenderer } from './hooks/usePaymentRequestPaymentColumnRender'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { Payment } from '@mui/icons-material'
import PaymentRequestPaymentDetailsAction from 'design-library/molecules/drawers/actions/payments/payment-request-payment-details-action/payment-request-payment-details-action'

const PaymentRequestPayments = ({
  user,
  account,
  paymentRequestPayments,
  fetchAccount,
  listPaymentRequestPayments,
  refundPaymentRequestPayment
}) => {
  const history = useHistory()
  const [selectedPayment, setSelectedPayment] = React.useState<any | null>(null)

  const handleGoToPayoutSettings = () => history.push('/profile/payout-settings')

  const paymentRequestPaymentsCustomColumnRenderer = usePaymentRequestPaymentsCustomColumnRenderer({
    onDetails: (item) => {
      setSelectedPayment(item)
    },
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
        emptyComponent={
          <EmptyBase
            icon={<Payment fontSize="large" />}
            text={
              <FormattedMessage
                id="account.profile.paymentRequests.payments.empty.title"
                defaultMessage="No payments received yet"
              />
            }
          />
        }
      />
      <PaymentRequestPaymentDetailsAction
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
        completed={true}
      />
    </>
  )
}

export default PaymentRequestPayments
