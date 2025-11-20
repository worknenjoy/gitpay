import React from 'react'
import EmptyBase from '../empty-base/empty-base'
import { CardMembershipOutlined as EmptyPaymentRequestIcon } from '@mui/icons-material' // you can replace this icon
import { FormattedMessage } from 'react-intl'

const EmptyPaymentRequest = ({ onActionClick }) => {
  return (
    <EmptyBase
      text={
        <FormattedMessage
          id="emptyPaymentRequest.text"
          defaultMessage="You have no payment requests yet"
        />
      }
      actionText={
        <FormattedMessage
          id="emptyPaymentRequest.actionText"
          defaultMessage="Make your first Payment Request"
        />
      }
      onActionClick={onActionClick}
      icon={<EmptyPaymentRequestIcon />}
    />
  )
}

export default EmptyPaymentRequest
