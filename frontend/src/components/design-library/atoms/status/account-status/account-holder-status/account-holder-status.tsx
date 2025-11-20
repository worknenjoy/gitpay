import React from 'react'
import getAccountHolderStatusStyles from './account-holder-status.styles'
import { useTheme } from '@mui/material/styles'
import {
  CheckCircleOutlineTwoTone as ActiveIcon,
  InfoSharp as InfoIcon,
  HelpOutline as QuestionInfoIcon,
  NotInterested as InactiveIcon,
} from '@mui/icons-material'

import BaseStatus from '../../base-status/base-status'

interface AccountHolderStatusProps {
  status: string
  completed?: boolean // Optional prop to indicate if the status is completed
}

const AccountHolderStatus: React.FC<AccountHolderStatusProps> = ({
  status,
  completed = true, // Default to true if not provided
}) => {
  const theme = useTheme()
  const styles = getAccountHolderStatusStyles(theme)

  const statusList = [
    {
      status: 'pending',
      label: 'Pending',
      color: 'pending',
      icon: <InfoIcon sx={styles.pending} />,
      message:
        'Your status is pending. Please provide additional information to complete your profile.',
    },
    { status: 'active', label: 'Active', color: 'active', icon: <ActiveIcon sx={styles.active} /> },
    {
      status: 'inactive',
      label: 'Inactive',
      color: 'inactive',
      icon: <InactiveIcon sx={styles.inactive} />,
      message:
        'Your account is inactive. Please complete all required information. If your account remains inactive, contact support at issues@gitpay.me for assistance.',
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
export default AccountHolderStatus
