import React from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '@mui/material/Button'
import { RightActions } from '../actions.styles'

const OfferDrawerActions = ({ disabled, onClose }) => {
  return (
    <RightActions>
      <Button onClick={onClose} color="primary" style={{ marginRight: 10 }}>
        <FormattedMessage id="task.bounties.actions.cancel" defaultMessage="Cancel" />
      </Button>
      <Button type="button" variant="contained" color="primary" disabled={disabled}>
        <FormattedMessage id="task.funding.form.send" defaultMessage="Send Invite" />
      </Button>
    </RightActions>
  )
}

export default OfferDrawerActions
