import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Edit as EditIcon, Link as LinkIcon } from '@mui/icons-material'

import {
  paymentRequestMetadata,
  paymentRequestPaymentsMetadata,
  paymentRequestPaymentsCustomColumnRenderer,
} from './payment-requests-table'

import {
  paymentRequestBalancesMetadata,
  paymentRequestBalancesCustomColumnRenderer,
} from './payment-requests-balance-table'

import EmptyPaymentRequest from 'design-library/molecules/content/empty/empty-payment-request/empty-payment-request'
import PaymentRequestDrawer from 'design-library/molecules/drawers/payment-request-drawer/payment-request-drawer'
import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import LinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/link-field/link-field'
import PaymentRequestActiveField from 'design-library/molecules/tables/section-table/section-table-custom-fields/payment-request/payment-request-active-field/payment-request-active-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'

const PaymentRequests = ({
  paymentRequests,
  paymentRequestPayments,
  paymentRequestBalances,
  createPaymentRequest,
  listPaymentRequests,
  listPaymentRequestPayments,
  listPaymentRequestBalances,
  updatePaymentRequest,
}) => {
  const classes = { gutterLeft: { marginLeft: 10 } } as const
  const { completed, data } = paymentRequests

  const [createPaymentRequestCompleted, setCreatePaymentRequestCompleted] = React.useState(true)
  const [openNewPaymentRequestDrawer, setOpenNewPaymentRequestDrawer] = React.useState(false)

  const [processingUpdatePaymentRequest, setProcessingUpdatePaymentRequest] = React.useState(false)
  const [selectedPaymentRequest, setSelectedPaymentRequest] = React.useState<any | null>(null)

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
            children: 'Edit Payment Request',
            icon: <EditIcon />,
            onClick: () => openEditPaymentRequest(item),
          },
        ]}
      />
    ),
  }

  useEffect(() => {
    listPaymentRequests()
    listPaymentRequestPayments()
    listPaymentRequestBalances()
  }, [])

  const transactions = {
    completed: paymentRequestBalances?.completed,
    data: paymentRequestBalances?.data?.[0]?.PaymentRequestBalanceTransactions || [],
  }

  return (
    <>
      <PrimaryDataPage
        title={<FormattedMessage id="payment.requests.title" defaultMessage="Payment requests" />}
        description={
          <FormattedMessage
            id="payment.requests.description"
            defaultMessage="Here you can see all the payment requests on your account"
          />
        }
        activeTab="payment-requests"
        tabs={[
          {
            label: (
              <FormattedMessage
                id="payment.requests.tab.label"
                defaultMessage="Payment requests links"
              />
            ),
            value: 'payment-requests',
            table: {
              tableData: paymentRequests,
              tableHeaderMetadata: paymentRequestMetadata,
              customColumnRenderer: customColumnRenderer,
            },
          },
          {
            label: (
              <FormattedMessage
                id="payment.request.payments.tab.label"
                defaultMessage="Payments for payment requests"
              />
            ),
            value: 'payment-request-payments',
            table: {
              tableData: paymentRequestPayments,
              tableHeaderMetadata: paymentRequestPaymentsMetadata,
              customColumnRenderer: paymentRequestPaymentsCustomColumnRenderer,
            },
          },
          {
            label: (
              <FormattedMessage
                id="payment.request.balances.transactions.tab.label"
                defaultMessage="Disputes and refunds fees"
              />
            ),
            cards: [
              {
                title: (
                  <FormattedMessage
                    id="payment.request.balances.card.title"
                    defaultMessage="Disputes and refunds due"
                  />
                ),
                amount: parseInt(paymentRequestBalances?.data?.[0]?.balance) * -1 || 0,
                type: 'centavos',
              },
            ],
            value: 'payment-request-balances',
            table: {
              tableData: transactions,
              tableHeaderMetadata: paymentRequestBalancesMetadata,
              customColumnRenderer: paymentRequestBalancesCustomColumnRenderer,
            },
          },
        ]}
        displayAction={true}
        emptyComponent={
          <EmptyPaymentRequest onActionClick={() => setOpenNewPaymentRequestDrawer(true)} />
        }
        onActionClick={() => setOpenNewPaymentRequestDrawer(true)}
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
          data: selectedPaymentRequest,
        }}
      />
    </>
  )
}

export default PaymentRequests
