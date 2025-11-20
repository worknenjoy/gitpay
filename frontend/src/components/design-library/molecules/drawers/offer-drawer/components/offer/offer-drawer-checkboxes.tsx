import { Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import Checkboxes from '../../../../../atoms/inputs/checkboxes/checkboxes'

const OfferDrawerCheckboxes = ({ currentPrice, onLearnCheckboxChange, onConfirmOfferChange }) => {
  const checkboxes = [
    {
      onChange: onConfirmOfferChange,
      value: 'price',
      label: (
        <FormattedMessage id="task.bounties.interested.iWillDoFor" defaultMessage="I will do for">
          {(msg) => (
            <Typography variant="caption">
              {' '}
              {msg} <span style={{ fontWeight: 'bold' }}>${currentPrice}</span>{' '}
            </Typography>
          )}
        </FormattedMessage>
      )
    },
    {
      onChange: onLearnCheckboxChange,
      value: 'learning',
      label: (
        <FormattedMessage
          id="task.bounties.interested.iAmStarter"
          defaultMessage="I want to do for learning purposes"
        >
          {(msg) => <Typography variant="caption"> {msg} </Typography>}
        </FormattedMessage>
      )
    }
  ]

  return <Checkboxes checkboxes={checkboxes} />
}

export default OfferDrawerCheckboxes
