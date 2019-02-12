// CardSection.js
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import { CardElement } from 'react-stripe-elements'

class CardSection extends React.Component {
  render () {
    return (
      <label>
        { this.props.stripe ? (
          <CardElement
            style={ {
              base: { fontSize: '22px', marginTop: 20, marginBottom: 20 }
            } }
          />
        ) : (
          <Typography variant='caption'>
            <FormattedMessage id='card.loading' defaultMessage='Loading card form...' />
          </Typography>
        ) }
      </label>
    )
  }
}

CardSection.propTypes = {
  stripe: PropTypes.object
}

export default CardSection
