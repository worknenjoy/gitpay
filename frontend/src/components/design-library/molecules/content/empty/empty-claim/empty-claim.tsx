import React from 'react'
import EmptyBase from '../empty-base/empty-base'
import { AssignmentTurnedIn as EmptyClaimIcon } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'

const EmptyClaim = ({ onActionClick }) => {
  return (
    <EmptyBase
      text={<FormattedMessage id="emptyClaim.text" defaultMessage="You have no claims yet" />}
      secondaryText={
        <FormattedMessage
          id="emptyClaim.secondaryText"
          defaultMessage="Activate your account to start making claims on bounties and payment requests."
        />
      }
      actionText={<FormattedMessage id="emptyClaim.actionText" defaultMessage="Activate account" />}
      onActionClick={onActionClick}
      icon={<EmptyClaimIcon />}
    />
  )
}

export default EmptyClaim
