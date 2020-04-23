import React from "react";
import styled from "styled-components";
import {Typography} from "@material-ui/core";

const PaymentHeaderContainer = styled.div`
  padding:10px;
  text-align:right;
  float: right;
`;

export const PaymentHeader = ({...props}) => {
  const userVals = props.children ? props.children : 0;
  const paymentBounty = parseInt(userVals.values.available);


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
      return 'Wallet'
    }
  }

  const userPaymentHeader = () => {
    // console.log(checkPaymentAvailable);
    if (!checkPaymentAvailable) {
      return (
        <div>

          <Typography
            variant='display1' color='primary'
            style={{color: '#bbb', fontWeight: 'bold'}}>${paymentBounty}</Typography>
          < Typography variant='subheading'
                       style={{color: '#bbb', textTransform: 'uppercase', fontWeight: 'bold'}}>
            paid with credit card
          </Typography>
          <Typography variant='body2'
                      style={{color: '#bbb', fontWeight: 'bold'}}>
            You will only be paid when you
            <span style={{color: '#009688'}}>
        &nbsp;activate your account for {modeOfPayment()}
        </span>
          </Typography>
          <Typography variant='body2'
                      style={{color: '#bbb', fontWeight: 'bold'}}>
            Status
            <span style={{color: 'orange'}}>
     &nbsp;pending
    </span>
          </Typography>
        </div>
      )
    }
  }

  return (
    <PaymentHeaderContainer>
      {userPaymentHeader()}
    </PaymentHeaderContainer>

  )
}
