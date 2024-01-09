import React, { useEffect, useState } from 'react';

import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'
import MomentComponent from 'moment'
import PaymentTypeIcon from '../payment/payment-type-icon'

import {
  Container,
  withStyles,
  Button,
  Link,
  Typography
} from '@material-ui/core'

import {
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  SwapHoriz as TransferIcon,
  Receipt as ReceiptIcon
} from '@material-ui/icons'
import slugify from '@sindresorhus/slugify'

import TaskPaymentCancel from '../task/task-payment-cancel'
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import TaskOrderDetails from '../task/order/task-order-details'
import TaskOrderTransfer from '../task/order/task-order-transfer'
import PaymentRefund from './payment-refund'
import CustomPaginationActionsTable from './payments-table'

const styles = theme => ({
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  button: {
    width: 100,
    font: 10
  }
});

const Payments = ({ classes, tasks, orders, order, user, logged, listOrders, getOrderDetails, cancelPaypalPayment, transferOrder, refundOrder, intl }) => {
  const [cancelPaypalConfirmDialog, setCancelPaypalConfirmDialog] = useState(false);
  const [orderDetailsDialog, setOrderDetailsDialog] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const statuses = {
    open: intl.formatMessage(messages.openPaymentStatus),
    succeeded: intl.formatMessage(messages.succeededStatus),
    fail: intl.formatMessage(messages.failStatus),
    canceled: intl.formatMessage(messages.canceledStatus),
    refunded: intl.formatMessage(messages.refundedStatus)
  }

  useEffect(() => {
    listOrders({ userId: user.id });
  }, [listOrders, user.id]);

  const handlePayPalDialogOpen = (e, id) => {
    e.preventDefault();
    setCancelPaypalConfirmDialog(true);
    setCurrentOrderId(id);
  };

  const handlePayPalDialogClose = () => {
    setCancelPaypalConfirmDialog(false);
  };

  const handleCancelPaypalPayment = async () => {
    const orderId = currentOrderId;
    setCancelPaypalConfirmDialog(false);
    setOrderDetailsDialog(false);
    await cancelPaypalPayment(orderId);
  };

  const openOrderDetailsDialog = async (e, id) => {
    await getOrderDetails(id);
    setOrderDetailsDialog(true);
    setCurrentOrderId(id);
  };

  const openTransferDialog = async (e, item) => {
    await listTasks({});
    await filterTasks('userId');
    setTransferDialogOpen(true);
  };

  const openRefundDialog = async (e, item) => {
    setRefundDialogOpen(true);
    setCurrentOrderId(item.id);
  };

  const closeRefundDialog = async () => {
    setRefundDialogOpen(false);
  };

  const closeTransferDialog = (e, item) => {
    setTransferDialogOpen(false);
  };

  const closeOrderDetailsDialog = () => {
    setOrderDetailsDialog(false);
  };

  const retryPaypalPayment = (e, paymentUrl) => {
    e.preventDefault();

    if (paymentUrl) {
      window.location.href = paymentUrl;
      window.location.reload();
    }
  };

  /*
  const cancelPaypalPayment = (e, id) => {
    e.preventDefault();

    if (id) {
      handlePayPalDialogOpen(e, id);
    }
  };
  */

  const retryPaypalPaymentButton = (paymentUrl) => {
    return (
      <Button style={{ marginTop: 10, paddingTop: 2, paddingBottom: 2, width: 'auto' }} variant='contained' size='small' color='primary' className={classes.button} onClick={(e) => {
        retryPaypalPayment(e, paymentUrl);
      }}>
        <FormattedMessage id='general.buttons.retry' defaultMessage='Retry' />
        <RefreshIcon style={{ marginLeft: 5, marginRight: 5 }} />
      </Button>
    );
  };

  const cancelPaypalPaymentButton = (id) => {
    return (
      <Button style={{ paddingTop: 2, paddingBottom: 2, marginTop: 10, width: 'auto' }} variant='contained' size='small' color='primary' className={classes.button} onClick={(e) => {
        cancelPaypalPayment(e, id);
      }}>
        <FormattedMessage id='general.buttons.cancel' defaultMessage='Cancel' />
        <CancelIcon style={{ marginLeft: 5, marginRight: 5 }} />
      </Button>
    );
  };

  const detailsOrderButton = (item, userId) => {
    if (item.provider === 'paypal') {
      if (item.User && userId === item.User.id) {
        return (
          <Button
            style={{ paddingTop: 2, paddingBottom: 2, width: 'auto', marginRight: 5 }}
            variant='contained'
            size='small'
            color='primary'
            className={classes.button}
            onClick={(e) => openOrderDetailsDialog(e, item.id)}
          >
            <FormattedMessage id='general.buttons.details' defaultMessage='Details' />
            <InfoIcon style={{ marginLeft: 5, marginRight: 5 }} />
          </Button>
        );
      }
    }
  };

  const issueRow = issue => {
    return (
      <span>
        {issue && issue.title ? (
          <Link href='' onClick={(e) => {
            e.preventDefault();
            window.location.href = `/#/task/${issue.id}/${slugify(issue.title)}`;
            window.location.reload();
          }}>{issue.title}</Link>
        ) : (
          'no issue found'
        )}
      </span>
    );
  };

  const retryOrCancelButton = (item, userId) => {
    if (item.User && item.provider === 'paypal' && userId === item.User.id) {
      if ((item.status === 'fail' || item.status === 'open') && item.payment_url) {
        return retryPaypalPaymentButton(item.payment_url);
      } else if (item.status === 'succeeded') {
        return cancelPaypalPaymentButton(item.id);
      } else {
        return '';
      }
    }
  };

  const transferButton = (item, userId) => {
    if (item.User && item.provider === 'stripe' && userId === item.User.id) {
      if (item.status === 'succeeded' && item.Task && item.Task.status === 'open' && item.Task.paid === false && !item.Task.transfer_id) {
        return (
          <React.Fragment>
            <Button
              style={{ paddingTop: 2, paddingBottom: 2, width: 'auto', marginLeft: 5, marginRight: 5 }}
              variant='contained'
              size='small'
              color='primary'
              className={classes.button}
              onClick={(e) => openTransferDialog(e, item)}
            >
              <FormattedMessage id='general.buttons.transfer' defaultMessage='Transfer' />
              <TransferIcon style={{ marginLeft: 5, marginRight: 5 }} />
            </Button>
            <TaskOrderTransfer task={item.Task} order={item} onSend={transferOrder} tasks={tasks} open={transferDialogOpen} onClose={closeTransferDialog} />
          </React.Fragment>
        );
      } else {
        return '';
      }
    }
  };

  const refundButton = (item, userId) => {
    if (item.User && userId === item.User.id) {
      if (item.status === 'succeeded' && item.provider === 'stripe' && item.Task && item.Task.status === 'open' && item.Task.paid === false && !item.Task.transfer_id) {
        return (
          <React.Fragment>
            <Button
              style={{ paddingTop: 2, paddingBottom: 2, width: 'auto', marginTop: 10, marginRight: 5 }}
              variant='contained'
              size='small'
              color='primary'
              className={classes.button}
              onClick={(e) => openRefundDialog(e, item)}
            >
              <FormattedMessage id='general.buttons.refund' defaultMessage='Refund' />
              <ReceiptIcon style={{ marginLeft: 5, marginRight: 5 }} />
            </Button>
          </React.Fragment>
        );
      } else {
        return '';
      }
    }
  };

  const displayOrders = orders => {
    if (!orders) return [];

    if (!orders.length) {
      return [];
    }

    let userId;

    if (logged) {
      userId = user.id;
    }

    return orders.map((item, i) => [
      item.paid ? intl.formatMessage(messages.labelYes) : intl.formatMessage(messages.labelNo),
      <div style={{ display: 'inline-block' }}>
        <span style={{ display: 'inline-block', width: '100%', marginRight: '1rem', marginBottom: '1em' }}>{statuses[item.status]}</span>
      </div>,
      issueRow(item.Task),
      `$ ${item.amount}`,
      <PaymentTypeIcon type={item.provider} />,
      <Typography variant='caption'>{MomentComponent(item.createdAt).fromNow()}</Typography>,
      <div style={{ display: 'inline-block' }}>
        {detailsOrderButton(item, userId)}
        {retryOrCancelButton(item, userId)}
        {transferButton(item, userId)}
        {refundButton(item, userId)}
      </div>,
    ]);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <Container>
        <Typography variant='h5' gutterBottom>
          <FormattedMessage id='general.payments' defaultMessage='Payments' />
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
                : []
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
  );
};

Payments.propTypes = {
  classes: PropTypes.object.isRequired,
  handleTabChange: PropTypes.func,
  user: PropTypes.object,
  logged: PropTypes.bool,
  listOrders: PropTypes.func,
  getOrderDetails: PropTypes.func,
  cancelPaypalPayment: PropTypes.func,
  transferOrder: PropTypes.func,
  refundOrder: PropTypes.func,
  intl: PropTypes.object
};

export default injectIntl(withStyles(styles)(Payments));
