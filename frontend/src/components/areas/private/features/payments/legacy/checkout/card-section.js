// CardSection.js
import React from 'react'
import { CardElement } from 'react-stripe-elements'
import ReactPlaceholder from 'react-placeholder'

const CardSection = (props) => {
  return (
    <label>
      <ReactPlaceholder
        type="text"
        rows={4}
        ready={props.stripe}
      >
        <CardElement
          style={{
            base: { fontSize: '22px', marginTop: 20, marginBottom: 20 }
          }}
        />
      </ReactPlaceholder>
    </label>
  )
}

export default CardSection
