import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { cyan, blue, lime, orange } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import { status } from '../../../../../consts'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pending: {
      backgroundColor: orange[900],
      color: theme.palette.common.white,
    },
    draft: {
      backgroundColor: orange[500],
      color: theme.palette.common.white,
    },
    open: {
      backgroundColor: orange[300],
      color: theme.palette.common.white,
    },
    paid: {
      backgroundColor: lime[800],
      color: theme.palette.common.white,
    },
    failed: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
    uncollectible: {
      backgroundColor: cyan[500],
      color: theme.palette.common.white,
    },
    void: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white,
    },
    refunded: {
      backgroundColor: blue[500],
      color: theme.palette.common.white,
    },
    unknown: {
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.common.white
    }
  }),
);

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
          color: 'pending',
        };
      break;
      case invoice.draft:
        choosenStatus = {
          label: 'Draft',
          color: 'draft',
        };
      break;
      case `${invoice.open}`:
        choosenStatus = {
          label: 'Open',
          color: 'open',
        };
      break;
      case `${invoice.paid}`:
        choosenStatus = {
          label: 'Paid',
          color: 'paid',
        };
      break;
      case invoice.failed:
        choosenStatus = {
          label: 'Failed',
          color: 'failed',
        };
      break;
      case invoice.uncollectible:
        choosenStatus = {
          label: 'Uncollectible',
          color: 'uncollectible',
        };
      break;
      case invoice.void:
        choosenStatus = {
          label: 'Void',
          color: 'void',
        };
      break;
      case invoice.refunded:
        choosenStatus = {
          label: 'Refunded',
          color: 'refunded',
        };
      break;
      default:
        choosenStatus = {
          label: 'Unknown',
          color: 'unknown',
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
