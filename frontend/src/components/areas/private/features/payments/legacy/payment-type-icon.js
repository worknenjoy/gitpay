import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import logoPaypal from 'images/paypal-icon.png'
import creditCardIcon from 'images/credit-card-icon.svg'

const PaymentTypeIcon = (props) => {
  return (
    <div style={props?.style}>
      {props.type === 'paypal' ? (
        <div style={{ textAlign: 'left' }}>
          <img src={logoPaypal} width={32} />
        </div>
      ) : (
        <div style={{ textAlign: 'left', color: '#12789a', fontSize: 8 }}>
          <img src={creditCardIcon} width={32} /> <br />
          {!props.notext && (
            <span>
              <FormattedMessage id="payment.creditcard" defaultMessage="Credit Card" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

PaymentTypeIcon.propTypes = {
  type: PropTypes.string,
  notext: PropTypes.bool,
}

export default PaymentTypeIcon
