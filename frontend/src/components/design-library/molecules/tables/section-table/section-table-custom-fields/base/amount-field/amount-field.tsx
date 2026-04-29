import React from 'react'
import { useIntl } from 'react-intl'

import messages from '../../../../../../../../messages/messages'

const AmountField = ({
  value,
  currency = '$',
  placeholder
}: {
  value?: string | number
  currency?: string
  placeholder?: React.ReactNode
}) => {
  const intl = useIntl()
  const emptyDisplay = placeholder ?? intl.formatMessage(messages.noAmountDefined)
  return <div>{value && value !== '0' ? `${currency} ${value}` : emptyDisplay}</div>
}

export default AmountField
