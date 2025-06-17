import React from 'react';
import Chip from '@material-ui/core/Chip';
import { status } from '../../../../../../consts'
import useStyles from './invoice-status.styles'


type statusProps = {
  invoiceStatus: string;
}

type GetStatusProps = { label?: string, color?: 'pending' | 'draft' | 'open' | 'paid' | 'failed' | 'uncollectible' | 'void' | 'refunded' | 'unknown' }
type GetStatus = (currentStatus:string) => GetStatusProps

export default function InvoiceStatus({ invoiceStatus }:statusProps) {
  const classes = useStyles();

  const getStatus:GetStatus = (currentStatus:string) => {
    const { invoice } = status;
    let choosenStatus:GetStatusProps = {};
    switch (currentStatus) {
      case `${invoice.pending}`:
        choosenStatus = {
          label: 'Pending',
          color: 'pending'
        };
      break;
      case invoice.draft:
        choosenStatus = {
          label: 'Draft',
          color: 'draft'
        };
      break;
      case `${invoice.open}`:
        choosenStatus = {
          label: 'Open',
          color: 'open'
        };
      break;
      case `${invoice.paid}`:
        choosenStatus = {
          label: 'Paid',
          color: 'paid'
        };
      break;
      case invoice.failed:
        choosenStatus = {
          label: 'Failed',
          color: 'failed'
        };
      break;
      case invoice.uncollectible:
        choosenStatus = {
          label: 'Uncollectible',
          color: 'uncollectible'
        };
      break;
      case invoice.void:
        choosenStatus = {
          label: 'Void',
          color: 'void'
        };
      break;
      case invoice.refunded:
        choosenStatus = {
          label: 'Refunded',
          color: 'refunded'
        };
      break;
      default:
        choosenStatus = {
          label: 'Unknown',
          color: 'unknown'
        };
      break;
    }
    return choosenStatus;
  }

  const currentStatus = getStatus(invoiceStatus)

  return (
    <Chip size="small" label={currentStatus.label} className={classes[currentStatus.color]} />
  );
}
