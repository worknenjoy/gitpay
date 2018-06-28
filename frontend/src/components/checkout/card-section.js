// CardSection.js
import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
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
          <Typography variant='caption'>Card loading...</Typography>
        ) }
      </label>
    )
  }
}

CardSection.propTypes = {
  stripe: PropTypes.object
}

export default CardSection
