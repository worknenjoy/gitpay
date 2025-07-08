// CardSection.js
import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

const CardSection = (props) => {
  return (
    <label>
      <CardElement
        style={{
          base: { fontSize: '22px', marginTop: 20, marginBottom: 20 }
        }}
      />
    </label>
  )
}

export default CardSection
