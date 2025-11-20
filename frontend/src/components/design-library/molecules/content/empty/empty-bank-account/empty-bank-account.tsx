import React from 'react'
import EmptyBase from '../empty-base/empty-base'
import { AccountBalance as EmptyBankAccountIcon } from '@mui/icons-material' // you can replace this icon
import { FormattedMessage } from 'react-intl'

const EmptyBankAccount = ({ onActionClick }) => {
  return (
    <EmptyBase
      text={
        <FormattedMessage id="emptyBankAccount.text" defaultMessage="No bank account registered" />
      }
      actionText={
        <FormattedMessage id="emptyBankAccount.actionText" defaultMessage="Setup Bank Account" />
      }
      onActionClick={onActionClick}
      icon={<EmptyBankAccountIcon />}
    />
  )
}

export default EmptyBankAccount
