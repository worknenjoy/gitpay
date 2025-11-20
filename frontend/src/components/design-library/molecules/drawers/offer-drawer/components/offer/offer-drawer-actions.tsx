import React from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '@mui/material/Button'
import { RightActions } from '../actions.styles'

const OfferDrawerActions = ({ priceConfirmed, termsAgreed, onClose }) => {
  return (
    <RightActions>
      <Button onClick={onClose} color="primary" style={{ marginRight: 10 }}>
        <FormattedMessage id="general.actions.cancel" defaultMessage="Cancel" />
      </Button>
      <Button variant="contained" color="primary" disabled={priceConfirmed || termsAgreed}>
        <FormattedMessage id="issues.bounties.actions.work" defaultMessage="Create Offer" />
      </Button>
    </RightActions>
  )
}

export default OfferDrawerActions
