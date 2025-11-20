import React from 'react'
import { useIntl } from 'react-intl'
import AmountField from '../../base/amount-field/amount-field'

const IssuePriceField = ({ issue }) => {
  const intl = useIntl()
  const { value } = issue
  return <AmountField value={value} />
}

export default IssuePriceField
