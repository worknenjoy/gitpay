import React from 'react'
import { useTheme } from '@mui/material/styles'
import getStyles from './payment-request-status-field.styles'

import BaseStatus from 'design-library/atoms/status/base-status/base-status'

interface PaymentRequestStatusFieldProps {
  status: 'open' | 'paid'
  completed?: boolean
}

const PaymentRequestStatusField: React.FC<PaymentRequestStatusFieldProps> = ({
  status,
  completed = true
}) => {
  const theme = useTheme()
  const styles = getStyles(theme)

  const statusList = [
    {
      status: 'open',
      label: 'Open',
      color: 'open'
    },
    {
      status: 'paid',
      label: 'Paid',
      color: 'paid'
    }
  ]

  return (
    <BaseStatus status={status} statusList={statusList} styles={styles} completed={completed} />
  )
}

export default PaymentRequestStatusField
