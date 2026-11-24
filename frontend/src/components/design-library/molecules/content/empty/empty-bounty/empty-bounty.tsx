import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Paid as BountyIcon } from '@mui/icons-material'
import EmptyBase from '../empty-base/empty-base'

type EmptyBountyProps = {
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Replace the default action, e.g. with the add-bounty split button. */
  actionComponent?: React.ReactNode
}

const EmptyBounty = ({ onActionClick, actionComponent }: EmptyBountyProps) => (
  <EmptyBase
    icon={<BountyIcon />}
    iconSize={32}
    text={<FormattedMessage id="emptyBounty.text" defaultMessage="No bounty yet" />}
    secondaryText={
      <FormattedMessage
        id="emptyBounty.secondaryText"
        defaultMessage="Contributors can still send a solution and request payment."
      />
    }
    actionText={<FormattedMessage id="emptyBounty.actionText" defaultMessage="Add bounty" />}
    onActionClick={onActionClick}
    actionComponent={actionComponent}
  />
)

export default EmptyBounty
