import React from 'react'
import { useTheme } from '@mui/material/styles'
import getStyles from './payment-request-active-field.styles'
import BaseStatus from 'design-library/atoms/status/base-status/base-status'

interface PaymentRequestActiveFieldProps {
  status: 'yes' | 'no'
  completed?: boolean
}

const PaymentRequestActiveField: React.FC<PaymentRequestActiveFieldProps> = ({
  status,
  completed = true
}) => {
  const theme = useTheme()
  const styles = getStyles(theme)

  const statusList = [
    {
      status: 'yes',
      label: 'Yes',
      color: 'yes'
    },
    {
      status: 'no',
      label: 'No',
      color: 'no'
    }
  ]

  return (
    <BaseStatus status={status} statusList={statusList} styles={styles} completed={completed} />
  )
}

export default PaymentRequestActiveField
