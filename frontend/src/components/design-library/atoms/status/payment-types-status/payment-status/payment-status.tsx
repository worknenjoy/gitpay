import React from 'react'
import BaseStatus from '../../base-status/base-status'
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon
} from '@mui/icons-material'
import { getPaymentStatusStyles } from './payment-status.styles'
import { useTheme } from '@mui/material/styles'

interface PaymentStatusProps {
  status:
    | 'open'
    | 'pending'
    | 'succeeded'
    | 'paid'
    | 'failed'
    | 'expired'
    | 'canceled'
    | 'refunded'
    | 'unknown'
  completed?: boolean
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, completed = true }) => {
  const theme = useTheme()
  const styles = getPaymentStatusStyles(theme)
  const statusList = [
    {
      status: 'open',
      label: 'Open',
      color: 'open',
      icon: <InfoIcon sx={styles.open} />
    },
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon sx={styles.pending} />,
      message: 'Your payment is pending. Please wait while we process it.'
    },
    {
      status: 'succeeded',
      label: 'Succeeded',
      color: 'succeeded',
      icon: <ActiveIcon />
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'succeeded',
      icon: <ActiveIcon />
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: <InactiveIcon sx={styles.failed} />,
      message: 'Your payment has failed. Please try again or contact support.'
    },
    {
      status: 'expired',
      label: 'Expired',
      color: 'expired',
      icon: <InactiveIcon sx={styles.expired} />
    },
    {
      status: 'canceled',
      label: 'Canceled',
      color: 'canceled',
      icon: <InactiveIcon sx={styles.canceled} />
    },
    {
      status: 'refunded',
      label: 'Refunded',
      color: 'refunded',
      icon: <InfoIcon sx={styles.refunded} />
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: <QuestionInfoIcon sx={styles.unknown} />,
      message: 'Your status is unknown. Please check back later.'
    }
  ]

  return (
    <BaseStatus styles={styles} status={status} statusList={statusList} completed={completed} />
  )
}

export default PaymentStatus
