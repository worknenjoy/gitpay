import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { FormattedMessage } from 'react-intl'

const PaymentHeaderContainer = styled.div`
  padding:10px;
  text-align:right;
  float: right;
`;

export const PaymentHeader = ({...props}) => {
  const userVals = props.children ? props.children : 0;
  const paymentBounty = parseInt(userVals.values.available);
  const user = props.user
  console.log('user', user)

  //if available bounty is not equal to zero
  const checkPaymentAvailable = paymentBounty !== 0;
  //check mode of payment
  const modeOfPayment = () => {
    let card = userVals.values.card;
    let paypal = userVals.values.paypal;

    if (paypal > 0 && card < 1) {
      return 'Paypal'
    } else if (card > 0 && paypal < 1) {
      return 'Credit Card';
    } else {
      return 'Paypal and Credit Card'
    }
  }

  const userPaymentHeader = () => {
    if (checkPaymentAvailable) {
      return (
        <div>
          <Typography
            variant='h5' color='primary'
            style={{color: '#bbb', fontWeight: 'bold'}}>
              ${paymentBounty}
          </Typography>
          <Typography variant='h6'
                       style={{color: '#bbb', textTransform: 'uppercase', fontWeight: 'bold'}}>
            <FormattedMessage id='task.header.payment.type' defaultMessage='paid with {payment}' values={{payment: modeOfPayment()}} />
          </Typography>
          <Typography variant='body2' style={{color: '#bbb', fontWeight: 'bold'}}>
            <FormattedMessage id='task.header.payment.condition' defaultMessage='You will only be paid when you' />
            <span style={{color: '#009688'}}>
              &nbsp;<FormattedMessage id='task.header.payment.activation' defaultMessage='activate your account for {payment}' values={{payment: modeOfPayment()}} />
            </span>
          </Typography>
          { user &&  
          <React.Fragment>
            <Typography variant='body2'
                        style={{color: '#bbb', fontWeight: 'bold'}}>
              <FormattedMessage id='task.header.payment.status' defaultMessage='Status of your account:' />
            </Typography>
            <Typography variant='body2' style={{color: '#bbb', fontWeight: 'bold'}}>
              <FormattedMessage id='task.header.payment.creditcard.label' defaultMessage='Credit card' />
              {user.account_id ?
                (
                  <span style={{color: 'green'}}>
                    &nbsp; <FormattedMessage id='task.header.payment.status.creditcard.active' defaultMessage='active' />
                  </span>
                ) : (
                  <span style={{color: 'orange'}}>
                    &nbsp;<FormattedMessage id='task.header.payment.status.creditcard.pending' defaultMessage='pending' />
                  </span>
                )
              }
            </Typography>
            <Typography variant='body2' style={{color: '#bbb', fontWeight: 'bold'}}>
              Paypal 
              {user.paypal_id ?
                (
                  <span style={{color: 'green'}}>
                    &nbsp;<FormattedMessage id='task.header.payment.status.paypal.active' defaultMessage='active' />
                  </span>
                ) : (
                  <span style={{color: 'orange'}}>
                    &nbsp;<FormattedMessage id='task.header.payment.status.paypal.pending' defaultMessage='pending' />
                  </span>
                )
              }
            </Typography>
          </React.Fragment>
        }
      </div>
      )
    }
  }

  return (
    <PaymentHeaderContainer>
      {userPaymentHeader(props)}
    </PaymentHeaderContainer>
  )
}
