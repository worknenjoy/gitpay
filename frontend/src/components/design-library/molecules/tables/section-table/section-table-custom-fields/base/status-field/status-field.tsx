import React from 'react'
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon
} from '@mui/icons-material'
import classes, { StatusFieldRoot } from './status-field.styles'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'

const StatusField = ({ status }) => {
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
      label: 'Active',
      color: 'created',
      icon: <ActiveIcon className={classes.created} />
    },
    {
      status: 'in_transit',
      label: 'Inactive',
      color: 'in_transit',
      icon: <ActiveIcon className={classes.in_transit} />,
      message: 'Your payout is in transit and will be in your bank account soon.'
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid',
      icon: <ActiveIcon className={classes.paid} />,
      message: 'Your status is paid, it means is already in your bank account.'
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
    <StatusFieldRoot>
      <BaseStatus classes={classes} status={status} statusList={statusList} completed={true} />
    </StatusFieldRoot>
  )
}

export default StatusField
