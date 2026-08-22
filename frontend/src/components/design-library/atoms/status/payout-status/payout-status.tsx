import React from 'react'
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  NewLabel as CreatedIcon,
  AltRoute as InTransitIcon,
  NotInterested as CanceledIcon,
  MoneyOff as FailedIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon
} from '@mui/icons-material'
import classes, { PayoutStatusRoot } from './payout-status.styles'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'

const PayoutStatus = ({ status, completed = true }) => {
  const statusList = [
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon className={classes.pending} />,
      message: 'Your payout is pending. Please come back later to see the latest status.'
    },
    {
      status: 'created',
      label: 'Created',
      color: 'created',
      icon: <CreatedIcon className={classes.created} />
    },
    {
      status: 'requested',
      label: 'Requested',
      color: 'requested',
      icon: <CreatedIcon className={classes.requested} />,
      message: 'Your withdrawal was requested and is waiting to be processed.'
    },
    {
      status: 'awaiting_payment',
      label: 'Awaiting Payment',
      color: 'awaiting_payment',
      icon: <InfoIcon className={classes.awaiting_payment} />,
      message: 'Your withdrawal is awaiting payment. Please come back later to see the latest status.'
    },
    {
      status: 'in_transit',
      label: 'In Transit',
      color: 'in_transit',
      icon: <InTransitIcon className={classes.in_transit} />,
      message: 'Your payout is in transit and will be in your bank account soon.'
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: <FailedIcon className={classes.failed} />,
      message: 'Your payout was failed. Please check with your bank for more details.'
    },
    {
      status: 'canceled',
      label: 'Canceled',
      color: 'canceled',
      icon: <CanceledIcon className={classes.canceled} />,
      message: 'Your payout was canceled. Please check with your bank for more details.'
    },
    {
      status: 'denied',
      label: 'Denied',
      color: 'denied',
      icon: <FailedIcon className={classes.denied} />,
      message: 'Your withdrawal was denied. Please check your payout method for more details.'
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid',
      icon: <ActiveIcon className={classes.paid} />,
      message: 'Your status is paid, it means is already in your bank account.'
    },
    {
      status: 'completed',
      label: 'Completed',
      color: 'completed',
      icon: <ActiveIcon className={classes.completed} />,
      message: 'Your status is completed, it means is already in your bank account.'
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: <QuestionInfoIcon className={classes.unknown} />,
      message: 'Your status is unknown. Please check back later.'
    }
  ]
  return (
    <PayoutStatusRoot>
      <BaseStatus classes={classes} status={status} statusList={statusList} completed={completed} />
    </PayoutStatusRoot>
  )
}

export default PayoutStatus
