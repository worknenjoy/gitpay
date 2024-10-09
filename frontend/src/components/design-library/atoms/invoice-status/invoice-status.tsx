import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { cyan, blue, lime, orange } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import { status } from '../../../../consts'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }),
);

type statusProps = {
  invoiceStatus: string;
}

type GetStatusProps = { label?: string, color?: "secondary" | "default" | "primary" }
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
          color: 'default',
        };
      break;
      case invoice.draft:
        choosenStatus = {
          label: 'Draft',
          color: 'default',
        };
      break;
      case `${invoice.open}`:
        choosenStatus = {
          label: 'Open',
          color: 'secondary',
        };
      break;
      case `${invoice.paid}`:
        choosenStatus = {
          label: 'Paid',
          color: 'primary',
        };
      break;
      case invoice.failed:
        choosenStatus = {
          label: 'Failed',
          color: 'secondary',
        };
      break;
      case invoice.uncollectible:
        choosenStatus = {
          label: 'Uncollectible',
          color: 'secondary',
        };
      break;
      case invoice.void:
        choosenStatus = {
          label: 'Void',
          color: 'secondary',
        };
      break;
      case invoice.refunded:
        choosenStatus = {
          label: 'Refunded',
          color: 'secondary',
        };
      break;
      default:
        choosenStatus = {
          label: 'Unknown',
          color: 'default',
        };
      return choosenStatus;
    }
  }

  const currentStatus = getStatus(invoiceStatus)

  return (
    <Chip size="small" label={currentStatus?.label} color={currentStatus?.color} />
  );
}
