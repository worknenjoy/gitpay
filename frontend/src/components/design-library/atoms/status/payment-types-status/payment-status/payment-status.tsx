import React from 'react';
import { orange, green, yellow } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import { status } from '../../../../../../consts'
import useStyles from './payment-status.styles'


type statusProps = {
  orderStatus: string;
}

type GetStatusProps = { label?: string, color?: 'open' | 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'canceled' | 'expired' | 'unknown' }
type GetStatus = (currentStatus:string) => GetStatusProps

export default function PaymentStatus({ orderStatus }:statusProps) {
  const classes = useStyles();

  const getStatus:GetStatus = (currentStatus:string) => {
    const { order } = status;
    let choosenStatus:GetStatusProps = {};
    switch (currentStatus) {
      case `${order.open}`:
        choosenStatus = {
          label: 'Open',
          color: 'open',
        };
      break;
      case `${order.pending}`:
        choosenStatus = {
          label: 'Pending',
          color: 'pending',
        };
      break;
      case `${order.succeeded}`:
        choosenStatus = {
          label: 'Succeeded',
          color: 'succeeded',
        };
      break;
      case order.failed:
        choosenStatus = {
          label: 'Failed',
          color: 'failed',
        };
      break;
      case order.fail:
        choosenStatus = {
          label: 'Failed',
          color: 'failed',
        };
      break;
      case order.expired:
        choosenStatus = {
          label: 'Expired',
          color: 'expired',
        };
      break;
      case order.cancelled:
        choosenStatus = {
          label: 'Cancelled',
          color: 'failed',
        };
      break;
      case order.canceled:
        choosenStatus = {
          label: 'Cancelled',
          color: 'failed',
        };
      break;
      case order.refunded:
        choosenStatus = {
          label: 'Refunded',
          color: 'expired',
        };
      break;
      default:
        choosenStatus = {
          label: 'unknown',
          color: 'unknown',
        };
      break;
    }
    return choosenStatus;
  }

  const currentStatus = getStatus(orderStatus)

  return (
    <Chip size="small" label={currentStatus.label} className={classes[currentStatus.color]} />
  );
}
