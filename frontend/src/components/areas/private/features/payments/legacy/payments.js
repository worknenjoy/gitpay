import React, { useEffect, useState, useCallback } from 'react'

import { messages } from '../../../../../../messages/messages'
import MomentComponent from 'moment'
import PaymentProvider from 'design-library/atoms/badges/payment-provider/payment-provider'

import { Container, Button, Link, Typography } from '@mui/material'

import {
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  SwapHoriz as TransferIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'
import slugify from '@sindresorhus/slugify'

import TaskPaymentCancel from '../../../../public/features/issue/legacy/task-payment-cancel'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'

import TaskOrderDetails from '../../../../public/features/issue/legacy/order/task-order-details'
import TaskOrderTransfer from '../../../../public/features/issue/legacy/order/task-order-transfer'
import PaymentRefund from './payment-refund'
import CustomPaginationActionsTable from './payments-table'
import InvoiceStatus from 'design-library/atoms/status/payment-types-status/invoice-status/invoice-status'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'

// styles replaced by sx inline

const Payments = ({
  classes,
  tasks,
  orders,
  order,
  user,
  logged,
  listOrders,
  listTasks,
  filterTasks,
  getOrderDetails,
  cancelPaypalPayment,
  transferOrder,
  refundOrder,
  updateOrder,
  intl
}) => {
  const [cancelPaypalConfirmDialog, setCancelPaypalConfirmDialog] = useState(false)
  const [orderDetailsDialog, setOrderDetailsDialog] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(null)
  const [transferOpened, setTransferOpened] = useState(false)

  const statuses = {
    open: intl.formatMessage(messages.openPaymentStatus),
    succeeded: intl.formatMessage(messages.succeededStatus),
    fail: intl.formatMessage(messages.failStatus),
    failed: intl.formatMessage(messages.failStatus),
    canceled: intl.formatMessage(messages.canceledStatus),
    refunded: intl.formatMessage(messages.refundedStatus),
    expired: intl.formatMessage(messages.expiredStatus)
  }

  useEffect(() => {
    listOrders({ userId: user.id })
  }, [])

  const handlePayPalDialogOpen = (e, id) => {
    e.preventDefault()
    setCancelPaypalConfirmDialog(true)
    setCurrentOrderId(id)
  }

  const handlePayPalDialogClose = () => {
    setCancelPaypalConfirmDialog(false)
  }

  const handleCancelPaypalPayment = async () => {
    const orderId = currentOrderId
    setCancelPaypalConfirmDialog(false)
    setOrderDetailsDialog(false)
    await cancelPaypalPayment(orderId)
  }

  const openOrderDetailsDialog = async (e, id) => {
    await getOrderDetails(id)
    setOrderDetailsDialog(true)
    setCurrentOrderId(id)
  }

  const handleTransferDrawer = useCallback(async () => {
    if (!transferOpened) {
      await listTasks({})
      await filterTasks('userId')
      setTransferOpened(true)
    }
    setTransferDialogOpen(true)
  }, [])

  const openTransferDialog = async (e) => {
    e.preventDefault()
    await handleTransferDrawer()
  }

  const openRefundDialog = async (e, item) => {
    setRefundDialogOpen(true)
    setCurrentOrderId(item.id)
  }

  const closeRefundDialog = async () => {
    setRefundDialogOpen(false)
  }

  const closeTransferDialog = (e, item) => {
    setTransferDialogOpen(false)
  }

  const closeOrderDetailsDialog = () => {
    setOrderDetailsDialog(false)
  }

  const retryPaypalPayment = (e, item) => {
    e.preventDefault()
    const { payment_url: paymentUrl, status } = item
    if (status === 'expired') {
      return updateOrder({ id: item.id }).then((order) => {
        if (order.order.payment_url) {
          window.location.href = order.order.payment_url
        }
      })
    }
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  /*
  const cancelPaypalPayment = (e, id) => {
    e.preventDefault();

    if (id) {
      handlePayPalDialogOpen(e, id);
    }
  };
  */

  const retryPaypalPaymentButton = (item) => {
    const { payment_url: paymentUrl } = item
    return (
      <Button
        variant="contained"
        size="small"
        color="secondary"
        sx={{ width: 100, fontSize: 10, m: 0.5 }}
        onClick={(e) => {
          retryPaypalPayment(e, item)
        }}
      >
        <FormattedMessage id="general.buttons.retry" defaultMessage="Retry" />
        <RefreshIcon sx={{ ml: 1 }} />
      </Button>
    )
  }

  const cancelPaypalPaymentButton = (id) => {
    return (
      <Button
        variant="contained"
        size="small"
        color="secondary"
        sx={{ width: 100, fontSize: 10, m: 0.5 }}
        onClick={(e) => {
          cancelPaypalPayment(id)
        }}
      >
        <FormattedMessage id="general.buttons.cancel" defaultMessage="Cancel" />
        <CancelIcon sx={{ ml: 1 }} />
      </Button>
    )
  }

  const detailsOrderButton = (item, userId) => {
    if (item.provider === 'paypal') {
      if (item.User && userId === item.User.id) {
        return (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            sx={{ width: 100, fontSize: 10, m: 0.5 }}
            onClick={(e) => openOrderDetailsDialog(e, item.id)}
          >
            <FormattedMessage id="general.buttons.details" defaultMessage="Details" />
            <InfoIcon sx={{ ml: 1 }} />
          </Button>
        )
      }
    }
  }

  const issueRow = (issue) => {
    return (
      <span>
        {issue && issue.title ? (
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/#/task/${issue.id}/${slugify(issue.title)}`
              window.location.reload()
            }}
          >
            {issue.title}
          </Link>
        ) : (
          'no issue found'
        )}
      </span>
    )
  }

  const retryOrCancelButton = (item, userId) => {
    if (item.User && item.provider === 'paypal' && userId === item.User.id) {
      if (
        (item.status === 'fail' ||
          item.status === 'open' ||
          item.status === 'expired' ||
          item.status === 'canceled') &&
        item.payment_url
      ) {
        return retryPaypalPaymentButton(item)
      } else if (item.status === 'succeeded') {
        return cancelPaypalPaymentButton(item.id)
      } else {
        return ''
      }
    }
  }

  const transferButton = (item, userId) => {
    if (item.User && item.provider === 'stripe' && userId === item.User.id) {
      if (
        item.status === 'succeeded' &&
        item.Task &&
        item.Task.status === 'open' &&
        item.Task.paid === false &&
        !item.Task.transfer_id
      ) {
        return (
          <React.Fragment>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              sx={{ width: 100, fontSize: 10, m: 0.5 }}
              onClick={(e) => openTransferDialog(e)}
            >
              <FormattedMessage id="general.buttons.transfer" defaultMessage="Transfer" />
              <TransferIcon sx={{ ml: 1 }} />
            </Button>
            <TaskOrderTransfer
              task={item.Task}
              order={item}
              onSend={transferOrder}
              tasks={tasks}
              open={transferDialogOpen}
              onClose={closeTransferDialog}
              listOrders={async () => await listOrders({ userId: user.id })}
            />
          </React.Fragment>
        )
      } else {
        return ''
      }
    }
  }

  const refundButton = (item, userId) => {
    if (item.User && userId === item.User.id) {
      if (
        item.status === 'succeeded' &&
        item.provider === 'stripe' &&
        item.Task &&
        item.Task.status === 'open' &&
        item.Task.paid === false &&
        !item.Task.transfer_id
      ) {
        return (
          <React.Fragment>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              sx={{ width: 100, fontSize: 10, m: 0.5 }}
              onClick={(e) => openRefundDialog(e, item)}
            >
              <FormattedMessage id="general.buttons.refund" defaultMessage="Refund" />
              <ReceiptIcon sx={{ ml: 1 }} />
            </Button>
          </React.Fragment>
        )
      } else {
        return ''
      }
    }
  }

  const displayOrders = (orders) => {
    if (!orders) return []

    if (!orders.length) {
      return []
    }

    let userId

    if (logged) {
      userId = user.id
    }

    return orders.map((item, i) => [
      item.paid ? intl.formatMessage(messages.labelYes) : intl.formatMessage(messages.labelNo),
      item.source_type === 'invoice-item' ? (
        <InvoiceStatus
          status={item.status === 'succeeded' ? 'paid' : item.status}
          completed={item.completed}
        />
      ) : (
        <PaymentStatus status={item.status} completed={item.completed} />
      ),
      issueRow(item.Task),
      `$ ${item.amount}`,
      <PaymentProvider provider={item.provider} sourceType={item.source_type} />,
      MomentComponent(item.createdAt).fromNow(),
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {detailsOrderButton(item, userId)}
        {retryOrCancelButton(item, userId)}
        {transferButton(item, userId)}
        {refundButton(item, userId)}
      </div>
    ])
  }

  return (
    <div style={{ marginTop: 40 }}>
      <Container>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="general.payments" defaultMessage="Payments" />
        </Typography>
        <div style={{ marginTop: 40, marginBottom: 30 }}>
          <CustomPaginationActionsTable
            tableHead={[
              intl.formatMessage(messages.cardTableHeaderPaid),
              intl.formatMessage(messages.cardTableHeaderStatus),
              intl.formatMessage(messages.cardTableHeaderIssue),
              intl.formatMessage(messages.cardTableHeaderValue),
              intl.formatMessage(messages.cardTableHeaderPayment),
              intl.formatMessage(messages.cardTableHeaderCreated),
              intl.formatMessage(messages.cardTableHeaderActions)
            ]}
            payments={
              orders && orders.data && orders.data.length
                ? { ...orders, data: displayOrders(orders.data) }
                : { ...orders, data: [] }
            }
          />
        </div>
      </Container>
      <TaskPaymentCancel
        cancelPaypalConfirmDialog={cancelPaypalConfirmDialog}
        handlePayPalDialogClose={handlePayPalDialogClose}
        handleCancelPaypalPayment={handleCancelPaypalPayment}
        listOrders={async () => listOrders({ userId: user.id })}
      />
      <TaskOrderDetails
        open={orderDetailsDialog}
        order={order}
        onClose={closeOrderDetailsDialog}
        onCancel={handlePayPalDialogOpen}
      />
      <PaymentRefund
        open={refundDialogOpen}
        handleClose={() => closeRefundDialog()}
        orderId={currentOrderId}
        onRefund={refundOrder}
        listOrders={async () => listOrders({ userId: user.id })}
      />
    </div>
  )
}

Payments.propTypes = {
  handleTabChange: PropTypes.func,
  user: PropTypes.object,
  logged: PropTypes.bool,
  listOrders: PropTypes.func,
  getOrderDetails: PropTypes.func,
  cancelPaypalPayment: PropTypes.func,
  transferOrder: PropTypes.func,
  refundOrder: PropTypes.func,
  intl: PropTypes.object
}

export default injectIntl(Payments)
