import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { Edit as EditIcon, Link as LinkIcon } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'

import { paymentRequestMetadata } from './payment-requests-table'

import EmptyPaymentRequest from 'design-library/molecules/content/empty/empty-payment-request/empty-payment-request'
import PaymentRequestDrawer from 'design-library/molecules/drawers/payment-request-drawer/payment-request-drawer'
import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import LinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/link-field/link-field'
import PaymentRequestActiveField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payment-request/payment-request-active-field/payment-request-active-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import { validAccount } from '../../../../../utils/valid-account'

const PaymentRequests = ({
  user,
  account,
  paymentRequests,
  createPaymentRequest,
  fetchAccount,
  listPaymentRequests,
  updatePaymentRequest
}) => {
  const history = useHistory()

  const [createPaymentRequestCompleted, setCreatePaymentRequestCompleted] = React.useState(true)
  const [openNewPaymentRequestDrawer, setOpenNewPaymentRequestDrawer] = React.useState(false)

  const [processingUpdatePaymentRequest, setProcessingUpdatePaymentRequest] = React.useState(false)
  const [selectedPaymentRequest, setSelectedPaymentRequest] = React.useState<any | null>(null)

  const isAccountValid = validAccount(user, account)

  const handleGoToPayoutSettings = () => history.push('/profile/payout-settings')

  const handleOpenCreatePaymentRequestDrawer = () => {
    if (!isAccountValid) {
      handleGoToPayoutSettings()
      return
    }
    setOpenNewPaymentRequestDrawer(true)
  }

  const handlePaymentRequestCreate = async (e, data) => {
    e.preventDefault()
    try {
      setCreatePaymentRequestCompleted(false)
      await createPaymentRequest(data)
      setOpenNewPaymentRequestDrawer(false)
      await listPaymentRequests()
    } catch (error) {
      console.error('Error creating payment request:', error)
    } finally {
      setCreatePaymentRequestCompleted(true)
    }
  }

  const openEditPaymentRequest = (item: any) => {
    setSelectedPaymentRequest(item)
  }

  const handleCloseDrawer = () => {
    setSelectedPaymentRequest(null)
  }

  const handleUpdatePaymentRequest = async (e, paymentRequest) => {
    e.preventDefault()
    setProcessingUpdatePaymentRequest(true)
    await updatePaymentRequest({ id: selectedPaymentRequest.id, ...paymentRequest })
    setProcessingUpdatePaymentRequest(false)
    handleCloseDrawer()
  }

  const customColumnRenderer = {
    active: (item: any) => <PaymentRequestActiveField status={item.active ? 'yes' : 'no'} />,
    title: (item: any) => <TextField title={item.title} />,
    description: (item: any) => <TextField title={item.description} />,
    amount: (item: any) => <AmountField value={item.amount} />,
    paymentLink: (item: any) => (
      <LinkField
        url={item.payment_url}
        icon={<LinkIcon />}
        title={item.payment_url}
        tooltipTitle="Open payment link in external browser"
        limit={25}
        width={200}
        external
        copiable
      />
    ),
    createdAt: (item: any) => <CreatedField createdAt={item.createdAt} />,
    actions: (item: any) => (
      <ActionField
        actions={[
          {
            children: <FormattedMessage id="payment.requests.update" defaultMessage="Update Payment Request" />,
            icon: <EditIcon />,
            onClick: () => openEditPaymentRequest(item)
          }
        ]}
      />
    )
  }

  useEffect(() => {
    fetchAccount?.()
    listPaymentRequests()
  }, [])

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <AccountRequirements user={user} account={account} onClick={handleGoToPayoutSettings} />
      </Box>
      <PrimaryDataPage
        title={
          <FormattedMessage
            id="account.profile.paymentRequests.links.title"
            defaultMessage="Payment Requests links"
          />
        }
        description={
          <FormattedMessage
            id="account.profile.paymentRequests.links.description"
            defaultMessage="Here you can see all the payment request links on your account"
          />
        }
        table={{
          tableData: paymentRequests,
          tableHeaderMetadata: paymentRequestMetadata,
          customColumnRenderer: customColumnRenderer
        }}
        displayAction={isAccountValid}
        emptyComponent={
          <EmptyPaymentRequest onActionClick={handleOpenCreatePaymentRequestDrawer} />
        }
        onActionClick={handleOpenCreatePaymentRequestDrawer}
        onActionText={
          <FormattedMessage
            id="payment.requests.create"
            defaultMessage="Create new payment request"
          />
        }
      />
      <PaymentRequestDrawer
        open={openNewPaymentRequestDrawer}
        onClose={() => setOpenNewPaymentRequestDrawer(false)}
        onSuccess={handlePaymentRequestCreate}
        completed={createPaymentRequestCompleted}
      />
      <PaymentRequestDrawer
        open={!!selectedPaymentRequest}
        onClose={handleCloseDrawer}
        completed={!processingUpdatePaymentRequest}
        onSuccess={handleUpdatePaymentRequest}
        paymentRequest={{
          completed: !processingUpdatePaymentRequest,
          data: selectedPaymentRequest
        }}
      />
    </>
  )
}

export default PaymentRequests
