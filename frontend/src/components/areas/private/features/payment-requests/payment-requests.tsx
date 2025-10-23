import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Paper,
  Container,
  Button
} from '@mui/material'

import { AddRounded as AddIcon } from '@mui/icons-material'

import EmptyPaymentRequest from 'design-library/molecules/content/empty/empty-payment-request/empty-payment-request'
import PaymentRequestDrawer from 'design-library/molecules/drawers/payment-request-drawer/payment-request-drawer'
import ProfileHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import PaymentRequestsTable from './payment-requests-table'

const PaymentRequests = ({ paymentRequests, paymentRequest, createPaymentRequest, listPaymentRequests, updatePaymentRequest }) => {
  const classes = { gutterLeft: { marginLeft: 10 } } as const
  const { completed, data } = paymentRequests

  const [ createPaymentRequestCompleted, setCreatePaymentRequestCompleted ] = React.useState(true)
  const [openNewPaymentRequestDrawer, setOpenNewPaymentRequestDrawer] = React.useState(false)

  const handlePaymentRequestCreate = async (e, data) => {
    e.preventDefault()
    try {
      setCreatePaymentRequestCompleted(false)
      await createPaymentRequest(data)
      setOpenNewPaymentRequestDrawer(false)
      listPaymentRequests() // Refresh the list after creating a new payment request
    } catch (error) {
      console.error('Error creating payment request:', error)
    } finally {
      setCreatePaymentRequestCompleted(true)
    }
  }

  useEffect(() => {
    listPaymentRequests()
  }, [])

  return (
    <Container>
      <ProfileHeader
        title={<FormattedMessage id="payment.requests.title" defaultMessage="Payment requests" />}
        subtitle={<FormattedMessage id="payment.requests.description" defaultMessage="Here you can see all the payment requests on your account" />}
        aside={
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setOpenNewPaymentRequestDrawer(true)}
            endIcon={<AddIcon />}
          >
            <FormattedMessage id="payment.requests.create" defaultMessage="Create new payment request" />
          </Button>
        }
      />

      {data.length === 0 && completed ? (

        <Paper>
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginTop: 20, marginBottom: 20, padding: 20 }}>
              <EmptyPaymentRequest onActionClick={() => setOpenNewPaymentRequestDrawer(true)} />
            </div>
          </div>
        </Paper>

      ) : (
        <PaymentRequestsTable
          paymentRequests={paymentRequests}
          listPaymentRequests={listPaymentRequests}
          updatePaymentRequest={updatePaymentRequest}
        />
      )}
      <PaymentRequestDrawer
        open={openNewPaymentRequestDrawer}
        onClose={() => setOpenNewPaymentRequestDrawer(false)}
        onSuccess={handlePaymentRequestCreate}
        completed={createPaymentRequestCompleted}
      />
    </Container>
  )
}

export default PaymentRequests
