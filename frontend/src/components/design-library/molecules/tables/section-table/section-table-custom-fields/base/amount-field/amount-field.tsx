import React from 'react'
import { useIntl } from 'react-intl'

import messages from '../../../../../../../../messages/messages'

const AmountField = ({ value, currency = '$' }) => {
  const intl = useIntl()
  return (
    <div>
      {value
        ? value === '0'
          ? intl.formatMessage(messages.noAmountDefined)
          : `${currency} ${value}`
        : intl.formatMessage(messages.noAmountDefined)}
    </div>
  )
}

export default AmountField
