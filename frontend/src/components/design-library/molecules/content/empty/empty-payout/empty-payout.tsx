import React from 'react'
import EmptyBase from '../empty-base/empty-base'
import { SwapHoriz as EmptyPayoutIcon } from '@mui/icons-material' // you can replace this icon
import { FormattedMessage } from 'react-intl'

const EmptyPayout = ({ onActionClick }) => {
  return (
    <EmptyBase
      text={<FormattedMessage id="emptyPayout.text" defaultMessage="You have no payouts yet" />}
      actionText={
        <FormattedMessage
          id="emptyPayout.actionText"
          defaultMessage="Setup your bank account to receive payouts"
        />
      }
      onActionClick={onActionClick}
      icon={<EmptyPayoutIcon />}
    />
  )
}

export default EmptyPayout
