import React from 'react'
import { FormattedMessage } from 'react-intl'
import PullRequestIcon from 'design-library/atoms/icons/pull-request-icon/pull-request-icon'
import EmptyBase from '../empty-base/empty-base'

type EmptySolutionsProps = {
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const EmptySolutions = ({ onActionClick }: EmptySolutionsProps) => (
  <EmptyBase
    icon={<PullRequestIcon />}
    iconSize={32}
    text={<FormattedMessage id="emptySolutions.text" defaultMessage="No solutions yet" />}
    secondaryText={
      <FormattedMessage
        id="emptySolutions.secondaryText"
        defaultMessage="Pull requests sent as solutions for this issue show up here."
      />
    }
    actionText={<FormattedMessage id="emptySolutions.actionText" defaultMessage="Send solution" />}
    onActionClick={onActionClick}
  />
)

export default EmptySolutions
