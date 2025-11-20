import React from 'react'
import { useIntl } from 'react-intl'
import Constants from '../../../../../consts'
import {
  ChipStatusClosed,
  ChipStatusSuccess,
  AvatarStatusClosed,
  AvatarStatusSuccess
} from './issue-status-field.styles'

const IssueStatus = ({ status }) => {
  const intl = useIntl()
  return (
    <div style={{ width: 80 }}>
      {status === 'closed' ? (
        <ChipStatusClosed
          label={intl.formatMessage(Constants.STATUSES[status])}
          avatar={<AvatarStatusClosed style={{ width: 8, height: 8 }}> </AvatarStatusClosed>}
        />
      ) : (
        <ChipStatusSuccess
          label={intl.formatMessage(Constants.STATUSES[status])}
          avatar={<AvatarStatusSuccess style={{ width: 8, height: 8 }}> </AvatarStatusSuccess>}
        />
      )}
    </div>
  )
}

export default IssueStatus
