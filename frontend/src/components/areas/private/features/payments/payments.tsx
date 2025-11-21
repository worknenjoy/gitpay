import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from '../../../../../messages/messages'
import PrimaryDataPage from 'design-library/pages/private-pages/data-pages/primary-data-page/primary-data-page'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import InvoiceStatus from 'design-library/atoms/status/payment-types-status/invoice-status/invoice-status'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'
import { is } from 'bluebird'
import IssueLinkField from 'design-library/molecules/tables/section-table/section-table-custom-fields/issue/issue-link-field/issue-link-field'
import PaymentProvider from 'design-library/atoms/badges/payment-provider/payment-provider'
import { Created } from 'design-library/atoms/status/payout-status/payout-status.stories'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import IssueOrderDetailsAction from 'design-library/molecules/drawers/actions/payments/issue-order-details-action/issue-order-details-action'

const classes = {
  icon: {
    backgroundColor: 'black'
  },
  card: {},
  gutterLeft: {
    marginLeft: 10
  },
  media: {
    width: 600
  }
} as const

const Payments = ({ orders, order, user, listOrders, getOrderDetails, cancelPaypalPayment }) => {
  const intl = useIntl()
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null)

  useEffect(() => {
    listOrders({ userId: user.id })
  }, [user.id])

  useEffect(() => {
    if (selectedOrder) {
      getOrderDetails(selectedOrder.id)
    }
  }, [selectedOrder])

  return (
    <>
      <PrimaryDataPage
        title={<FormattedMessage id="payments.title" defaultMessage="Payments" />}
        description={<FormattedMessage id="payments.description" defaultMessage="Manage your payments here." />}
        displayAction={false}
        table={{
          tableData: orders,
          tableHeaderMetadata: {
            paid: { sortable: true, dataBaseKey: 'paid', label: intl.formatMessage(messages.cardTableHeaderPaid) },
            status: { sortable: true, dataBaseKey: 'status', label: intl.formatMessage(messages.cardTableHeaderStatus) },
            issue: { sortable: true, dataBaseKey: 'issue', label: intl.formatMessage(messages.cardTableHeaderIssue) },
            amount: { sortable: true, dataBaseKey: 'amount', label: intl.formatMessage(messages.cardTableHeaderValue) },
            paymentMethod: { sortable: false, dataBaseKey: 'paymentMethod', label: intl.formatMessage(messages.cardTableHeaderPayment) },
            created: { sortable: true, dataBaseKey: 'created', label: intl.formatMessage(messages.cardTableHeaderCreated) },
            actions: { sortable: false, dataBaseKey: 'actions', label: intl.formatMessage(messages.cardTableHeaderActions) }
          },
          customColumnRenderer: {
            paid: (item) => item.paid ? intl.formatMessage(messages.labelYes) : intl.formatMessage(messages.labelNo),
            status: (item) => item.source_type === 'invoice-item' ? <InvoiceStatus status={item.status} /> : <PaymentStatus status={item.status} />,
            issue: (item) => <IssueLinkField issue={item.Task} />,
            amount: (item) => <AmountField value={item.amount} />,
            paymentMethod: (item) => <PaymentProvider provider={item.provider} sourceType={item.source_type} />,
            created: (item) => <CreatedField createdAt={item.createdAt} />,
            actions: (item) => (
              <ActionField
                actions={[
                  {
                    children: <FormattedMessage id="payments.viewDetails" defaultMessage="View details" />,
                    onClick: () => {
                      setSelectedOrder(item)
                    }
                  }
                ]}
              />
            )
          }
        }}
      />
      { selectedOrder && (
        <IssueOrderDetailsAction
          open={!!selectedOrder}
          order={order}
          onClose={() => setSelectedOrder(null)}
          onCancel={() => cancelPaypalPayment(selectedOrder.id)}
        />  
      )}
    </>
  )
}

export default Payments
