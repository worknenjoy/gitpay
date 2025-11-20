import React from 'react'
import {
  CheckCircleOutlineTwoTone as CompletedIcon,
  NewLabel as CreatedIcon,
  ImportExport as ReversedIcon,
  AltRoute as InTransitIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
} from '@mui/icons-material'
import classes, { TransferStatusRoot } from './transfer-status.styles'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'

const TransferStatus = ({ status, completed = true }) => {
  const statusList = [
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon className={classes.pending} />,
      message: 'Your payout is pending. Please come back later to see the latest status.',
    },
    {
      status: 'created',
      label: 'Created',
      color: 'created',
      icon: <CreatedIcon className={classes.created} />,
    },
    {
      status: 'in_transit',
      label: 'In Transit',
      color: 'in_transit',
      icon: <InTransitIcon className={classes.in_transit} />,
      message: 'Your payout is in transit. Please come back later to see the latest status.',
    },
    {
      status: 'reversed',
      label: 'Reversed',
      color: 'reversed',
      icon: <ReversedIcon className={classes.reversed} />,
      message: 'Your payout was reversed. Please contact support for more information.',
    },
    {
      status: 'completed',
      label: 'Completed',
      color: 'completed',
      icon: <CompletedIcon className={classes.completed} />,
      message: 'Your payout is completed and should be in your bank account.',
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: <QuestionInfoIcon className={classes.unknown} />,
      message: 'Your status is unknown. Please check back later.',
    },
  ]
  return (
    <TransferStatusRoot>
      <BaseStatus classes={classes} status={status} statusList={statusList} completed={completed} />
    </TransferStatusRoot>
  )
}

export default TransferStatus
