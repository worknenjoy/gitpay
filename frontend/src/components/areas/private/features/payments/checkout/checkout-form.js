import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core'
import { injectStripe } from 'react-stripe-elements'

import CardSection from './card-section'
import UserSection from './user-section'
import Coupon from '../../../../../design-library/molecules/form-section/coupon-form/coupon'

const CheckoutForm = (props) => {
  const [checkoutFormState, setCheckoutFormState] = useState({
    email: null,
    fullname: null,
    authenticated: false,
    userId: null,
    error: {
      fullname: false,
      email: false,
      payment: false,
      message: 'loading'
    },
    paymentRequested: false
  })

  const [couponState, setCouponState] = useState({
    couponInput: false,
    coupon: '',
    couponApplied: false
  })

  const { couponStoreState } = props

  const handleSubmit = (ev) => {
    ev.preventDefault()

    setCheckoutFormState({ ...checkoutFormState, paymentRequested: true })

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    if (!checkoutFormState.fullname) {
      setCheckoutFormState({ ...checkoutFormState, error: { fullname: true } })
      return
    }
    else {
      setCheckoutFormState({ ...checkoutFormState, error: { fullname: false } })
    }

    if (!checkoutFormState.email) {
      setCheckoutFormState({ ...checkoutFormState, error: { email: true } })
    }
    else {
      setCheckoutFormState({ ...checkoutFormState, error: { email: false } })
    }
    if (!props.stripe) {
      return
    }
    props.stripe
      .createToken({ name: checkoutFormState.fullname })
      .then(({ token }) => {
        if (token) {
          try {
            props.onPayment({
              id: props.task,
              Orders: {
                source_id: token.id,
                currency: 'usd',
                provider: 'stripe',
                amount: props.price,
                email: checkoutFormState.email,
                userId: checkoutFormState.userId,
                plan: props.plan
              },
              coupon: couponState.couponApplied ? {
                code: couponState.coupon ? couponState.coupon : null,
                originalOrderPrice: props.price
              } : null
            })
            props.onClose()
          }
          catch (e) {
            console.log('error to process your payment', e)
            props.addNotification(
              'payment.message.error', e.message
            )
            setCheckoutFormState({
              ...checkoutFormState,
              paymentRequested: false
            })
          }
        }
        else {
          props.addNotification('payment.message.error', 'No token')
          setCheckoutFormState({
            ...checkoutFormState,
            paymentRequested: false
          })
        }
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log('error to create token')
        // eslint-disable-next-line no-console
        console.log(e)
        props.addNotification('payment.message.error', 'error to create token')
        setCheckoutFormState({
          ...checkoutFormState,
          paymentRequested: false
        })
      })

    // However, this line of code will do the same thing:
    // props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  const onChange = (ev) => {
    ev.preventDefault()
    let formData = {}
    formData[ev.target.name] = ev.target.value
    setCheckoutFormState({ ...checkoutFormState, ...formData, paymentRequested: false })
  }

  useEffect(() => {
    const { user } = props

    if (user && user.id) {
      setCheckoutFormState({
        ...checkoutFormState,
        authenticated: true,
        fullname: user.name,
        email: user.email,
        userId: user.id
      })
    }
  }, [])

  useEffect(() => {
    setCouponState({ ...couponState, couponApplied: false })
  }, [couponState.couponInput])

  const setCouponApplied = () => {
    if (couponStoreState.completed && Object.keys(couponStoreState.coupon).length > 0) {
      setCouponState({ ...couponState, couponApplied: true })
    }
  }

  const handleCouponApplied = useCallback(() => {
    setCouponApplied()
  }, [couponStoreState])

  useEffect(() => {
    handleCouponApplied()
  }, [handleCouponApplied])

  const showCouponInput = () => {
    setCouponState({ ...couponState, couponInput: true })
  }

  const handleCouponInput = (event) => {
    setCouponState({ ...couponState, coupon: event.target.value })
  }

  const applyCoupon = () => {
    props.validateCoupon(couponState.coupon, props.price)
  }

  const logged = checkoutFormState.authenticated
  const { user, price } = props

  return (
    <form
      onSubmit={ handleSubmit }
      onChange={ onChange }
      style={ { marginTop: 20 } }
    >
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } style={ { marginBottom: 20 } }>
          { logged ? (
            <div>
              { user && user.name ? (
                <div>
                  <Typography variant='caption'>
                    <FormattedMessage id='checkout.loggedas' defaultMessage='Logged as' />
                  </Typography>
                  <Typography variant='body1'>
                    { `${checkoutFormState.fullname} (${checkoutFormState.email})` }
                  </Typography>
                </div>
              ) : (
                <UserSection error={ checkoutFormState.error } name={ checkoutFormState.fullname } email={ checkoutFormState.email } />
              ) }
            </div>
          ) : (
            <UserSection error={ checkoutFormState.error } />
          ) }
        </Grid>
        <Grid item xs={ 12 }>
          <CardSection { ...props } />
        </Grid>
        <Grid item xs={ 12 }>
          <Coupon
            couponState={ couponState }
            handleCouponInput={ handleCouponInput }
            showCouponInput={ showCouponInput }
            applyCoupon={ applyCoupon }
            couponStoreState={ couponStoreState.coupon } />
        </Grid>
        <Grid item xs={ 12 }>
          <div style={ { marginTop: 20, marginBottom: 0, float: 'right' } }>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={ checkoutFormState.paymentRequested || price === 0 }
            >
              {
                (couponStoreState.coupon.orderPrice !== null || couponStoreState.coupon.orderPrice !== undefined) && couponStoreState.coupon.orderPrice >= 0 && couponState.couponApplied
                  ? <FormattedMessage id='checkout.payment.action' defaultMessage='Pay {price}' values={ { price: `$${couponStoreState.coupon.orderPrice}` } } />
                  : <FormattedMessage id='checkout.payment.action' defaultMessage='Pay {price}' values={ { price: props.formatedPrice } } />
              }
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  )
}

CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  onPayment: PropTypes.func,
  task: PropTypes.any,
  onClose: PropTypes.func,
  addNotification: PropTypes.func,
  price: PropTypes.any,
  priceAfterFee: PropTypes.string,
  user: PropTypes.object
}

export const CheckoutFormPure = CheckoutForm
export default injectStripe(CheckoutForm)
