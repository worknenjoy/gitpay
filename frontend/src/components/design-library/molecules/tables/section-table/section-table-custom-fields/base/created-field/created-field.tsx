import React from 'react'
import { useIntl } from 'react-intl'
import MomentComponent from 'moment'

import messages from '../../../../../../../../messages/messages'

const CreatedField = ({ createdAt }) => {
  const intl = useIntl()
  return (
    <div style={{ width: 120 }}>
      {createdAt ? MomentComponent(createdAt).fromNow() : intl.formatMessage(messages.noDefined)}
    </div>
  )
}

export default CreatedField
