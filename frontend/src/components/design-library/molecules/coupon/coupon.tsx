import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import { TextField, Chip, Button, Typography } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

const Coupon = (props) => {
  const { couponStoreState } = { ...props }

  if (props.couponState.couponInput) {
    return (
      <div style={ { display: 'flex', alignItems: 'center', flexDirection: 'row', flexFlow: 'wrap' } }>
        <TextField label='Coupon code' onChange={ props.handleCouponInput } variant='outlined' value={ props.couponState.coupon } disabled={ props.couponState.couponApplied } />
        {
          props.couponState.couponApplied
            ? (
              <div style={ { display: 'flex', alignItems: 'center' } }>
                <Chip label={ `${couponStoreState.amount}%` } style={ { margin: '0px 5px 0px 5px' } } />
                <Typography variant='caption'>
                  <FormattedMessage id='checkout.coupon.orderPrice' defaultMessage='Order price: $ {orderPrice}' values={ { orderPrice: couponStoreState.orderPrice } } />
                </Typography>
              </div>
            ) : (<Button color='primary' onClick={ props.applyCoupon } disabled={ props.couponState.coupon.length < 10 }>Apply</Button>)
        }
      </div>
    )
  }
  else {
    return (
      <Button color='primary' startIcon={ <AddIcon /> } onClick={ props.showCouponInput }>Add coupon</Button>
    )
  }
}

export default Coupon
