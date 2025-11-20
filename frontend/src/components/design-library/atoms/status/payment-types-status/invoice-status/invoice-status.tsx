import React from 'react'
import getInvoiceStatusStyles from './invoice-status.styles'
import BaseStatus from '../../base-status/base-status'
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon,
} from '@mui/icons-material'

interface InvoiceStatusProps {
  status: string
  completed?: boolean
}

import { useTheme } from '@mui/material/styles'

const InvoiceStatus: React.FC<InvoiceStatusProps> = ({ status, completed = true }) => {
  const theme = useTheme()
  const styles = getInvoiceStatusStyles(theme)

  const statusList = [
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon sx={styles.pending} />,
      message: 'Your invoice is pending. It may require additional actions to complete.',
    },
    {
      status: 'draft',
      label: 'Draft',
      color: 'draft',
      icon: <InactiveIcon sx={styles.draft} />,
      message: 'This invoice is in draft state and has not been finalized yet.',
    },
    {
      status: 'open',
      label: 'Open',
      color: 'open',
      icon: <InfoIcon sx={styles.open} />,
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid',
      icon: <ActiveIcon sx={styles.paid} />,
    },
    {
      status: 'failed',
      label: 'Failed',
      color: 'failed',
      icon: <InactiveIcon sx={styles.failed} />,
      message: 'This invoice payment has failed. Please retry or contact support.',
    },
    {
      status: 'uncollectible',
      label: 'Uncollectible',
      color: 'uncollectible',
      icon: <InactiveIcon sx={styles.uncollectible} />,
    },
    {
      status: 'void',
      label: 'Void',
      color: 'void',
      icon: <InactiveIcon sx={styles.void} />,
    },
    {
      status: 'refunded',
      label: 'Refunded',
      color: 'refunded',
      icon: <InfoIcon sx={styles.refunded} />,
    },
    {
      status: 'unknown',
      label: 'Unknown',
      color: 'unknown',
      icon: <QuestionInfoIcon sx={styles.unknown} />,
      message: 'Your status is unknown. Please check back later.',
    },
  ]

  return (
    <BaseStatus status={status} statusList={statusList} styles={styles} completed={completed} />
  )
}

export default InvoiceStatus
