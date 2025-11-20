import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

const CardSection = (props) => {
  return (
    <label>
      <CardElement
        options={{
          style: {
            base: { fontSize: '22px' },
          },
        }}
      />
    </label>
  )
}

export default CardSection
