import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  SwapHoriz as TransferIcon,
  DownloadDoneRounded as DownloadIcon,
  PaymentOutlined as PayIcon,
  PaymentsOutlined as PaymentIcon,
  ReceiptOutlined as ReceiptIcon
} from '@mui/icons-material'
import { messages } from '../../../../../messages/messages'
import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import InvoiceStatus from 'design-library/atoms/status/payment-types-status/invoice-status/invoice-status'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import PaymentProvider from 'design-library/atoms/badges/payment-provider/payment-provider'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import IssueOrderDetailsAction from 'design-library/molecules/drawers/actions/payments/issue-order-details-action/issue-order-details-action'
import IssueOrderTransferAction from 'design-library/molecules/drawers/actions/payments/issue-order-transfer-action/issue-order-transfer-action'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { useHistory } from 'react-router-dom'

const Payments = ({
  orders,
  tasks,
  order,
  user,
  listOrders,
  getOrderDetails,
  cancelPaypalPayment,
  transferOrder,
  listTasks,
  refundOrder
}) => {
  const history = useHistory()
  const intl = useIntl()
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null)
  const [ openDetailsOrder, setOpenDetailsOrder ] = React.useState<any | null>(null)
  const [selectedTransferOrder, setSelectedTransferOrder] = React.useState<any | null>(null)
  const [ downloadInvoice, setDownloadInvoice ] = React.useState<any | null>(null)
  const [ payInvoice, setPayInvoice ] = React.useState<any | null>(null)

  useEffect(() => {
    listOrders({ userId: user.id })
  }, [user.id])

  useEffect(() => {
    if (selectedOrder) {
      getOrderDetails(selectedOrder.id)
    }
  }, [selectedOrder])

  const onPayInvoice = async (item) => {
    const { data: orderDetails } = await getOrderDetails(item.id)
    const invoiceUrl = orderDetails?.stripe?.hosted_invoice_url
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank')
    }
  }

  const onDownloadInvoice = async (item) => {
    const { data: orderDetails } = await getOrderDetails(item.id)
    const invoicePdf = orderDetails?.stripe?.invoice_pdf
    if (invoicePdf) {
      window.open(invoicePdf, '_blank')
    }
  }

  return (
    <>
      <PrimaryDataPage
        title={<FormattedMessage id="payments.title" defaultMessage="Payments" />}
        description={
          <FormattedMessage id="payments.description" defaultMessage="Manage your payments here." />
        }
        emptyComponent={
          <EmptyBase
            icon={<PaymentIcon />}
            completed={orders.completed}
            text={<FormattedMessage id="payments.empty" defaultMessage="No payments found." />}
            actionText={
              <FormattedMessage
                id="payments.empty.action"
                defaultMessage="Make your first payment for a bounty"
              />
            }
            onActionClick={() => history.push('/profile/explore')}
          />
        }
        displayAction={false}
        table={{
          tableData: orders,
          tableHeaderMetadata: {
            paid: {
              sortable: true,
              dataBaseKey: 'paid',
              label: intl.formatMessage(messages.cardTableHeaderPaid)
            },
            status: {
              sortable: true,
              dataBaseKey: 'status',
              label: intl.formatMessage(messages.cardTableHeaderStatus)
            },
            issue: {
              sortable: true,
              dataBaseKey: 'issue',
              label: intl.formatMessage(messages.cardTableHeaderIssue)
            },
            amount: {
              sortable: true,
              dataBaseKey: 'amount',
              label: intl.formatMessage(messages.cardTableHeaderValue)
            },
            paymentMethod: {
              sortable: false,
              dataBaseKey: 'paymentMethod',
              label: intl.formatMessage(messages.cardTableHeaderPayment)
            },
            created: {
              sortable: true,
              dataBaseKey: 'created',
              label: intl.formatMessage(messages.cardTableHeaderCreated)
            },
            actions: {
              sortable: false,
              dataBaseKey: 'actions',
              label: intl.formatMessage(messages.cardTableHeaderActions)
            }
          },
          customColumnRenderer: {
            paid: (item) =>
              item.paid
                ? intl.formatMessage(messages.labelYes)
                : intl.formatMessage(messages.labelNo),
            status: (item) =>
              item.source_type === 'invoice-item' ? (
                <InvoiceStatus status={item.status} />
              ) : (
                <PaymentStatus status={item.status} />
              ),
            issue: (item) => <IssueLinkField issue={item.Task} />,
            amount: (item) => <AmountField value={item.amount} />,
            paymentMethod: (item) => (
              <PaymentProvider provider={item.provider} sourceType={item.source_type} />
            ),
            created: (item) => <CreatedField createdAt={item.createdAt} />,
            actions: (item) => (
              <ActionField
                actions={[
                  {
                    children: (
                      <FormattedMessage id="payments.viewDetails" defaultMessage="View details" />
                    ),
                    onClick: () => {
                      setSelectedOrder(item)
                      setOpenDetailsOrder(item)
                    }
                  },
                  item.provider === 'stripe' && item.source_type === 'invoice-item' && item.status === 'open'
                    ? {
                        icon: <PayIcon />,
                        children: (
                          <FormattedMessage
                            id="payments.order.payInvoice"
                            defaultMessage="Pay Invoice"
                          />
                        ),
                        onClick: () => {
                          onPayInvoice(item)
                        }
                      }
                    : null,
                item.provider === 'stripe' && item.source_type === 'invoice-item' && item.status === 'paid'
                  ? {
                      icon: <DownloadIcon />,
                      children: (
                        <FormattedMessage
                          id="payments.order.downloadInvoice"
                          defaultMessage="Download Invoice"
                        />
                      ),
                      onClick: () => {
                        onDownloadInvoice(item)
                      }
                    }
                  : null,
                  item.provider === 'stripe' &&
                  item.status === 'succeeded' &&
                  item.Task &&
                  item.Task.status === 'open' &&
                  item.Task.paid === false &&
                  !item.Task.transfer_id
                    ? {
                        children: (
                          <FormattedMessage
                            id="payments.order.transferBounty"
                            defaultMessage="Transfer Bounty"
                          />
                        ),
                        icon: <TransferIcon />,
                        onClick: () => {
                          setSelectedTransferOrder(item)
                        }
                      }
                    : null,
                  item.status === 'succeeded' &&
                  item.provider === 'stripe' &&
                  item.Task &&
                  item.Task.status === 'open' &&
                  item.Task.paid === false &&
                  !item.Task.transfer_id
                    ? {
                        children: (
                          <FormattedMessage id="general.buttons.refund" defaultMessage="Refund" />
                        ),
                        icon: <ReceiptIcon />,
                        confirm: {
                          dialogMessage: (
                            <FormattedMessage
                              id="user.profile.payments.refund.confirm"
                              defaultMessage="Are you sure you want to refund?"
                            />
                          ),
                          alertMessage: (
                            <FormattedMessage
                              id="user.profile.payments.refund.message"
                              defaultMessage="You will be refunded with the value paid for the issue, excluding fees"
                            />
                          )
                        },
                        onClick: async () => {
                          await refundOrder(item.id)
                          await listOrders({ userId: user.id })
                        }
                      }
                    : null
                ].filter(Boolean)}
              />
            )
          }
        }}
      />
      {openDetailsOrder && (
        <IssueOrderDetailsAction
          open={!!openDetailsOrder}
          order={order}
          onClose={() => setOpenDetailsOrder(null)}
          onCancel={() => cancelPaypalPayment(order.id)}
        />
      )}
      {selectedTransferOrder && (
        <IssueOrderTransferAction
          open={!!selectedTransferOrder}
          order={selectedTransferOrder}
          task={selectedTransferOrder.Task}
          tasks={tasks}
          onSend={transferOrder}
          onClose={() => setSelectedTransferOrder(null)}
          listOrders={() => listOrders({ userId: user.id })}
          listTasks={() => listTasks({ userId: user.id })}
        />
      )}
    </>
  )
}

export default Payments
