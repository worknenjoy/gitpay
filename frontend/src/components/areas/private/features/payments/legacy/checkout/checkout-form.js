import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Grid,
  Typography,
  Button
} from '@material-ui/core'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import CardSection from './card-section'
import UserSection from './user-section'
import Coupon from 'design-library/molecules/form-section/coupon-form/coupon'

const CheckoutForm = (props) => {
  const stripe = useStripe()
  const elements = useElements()

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

  const { couponStoreState, user, price, formatedPrice } = props

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setCheckoutFormState({ ...checkoutFormState, paymentRequested: true })

    if ((!checkoutFormState.fullname || checkoutFormState.fullname.length < 3 ) && !checkoutFormState.authenticated && !checkoutFormState.userId) {
      setCheckoutFormState((prev) => ({ ...prev, error: { ...prev.error, fullname: true }, paymentRequested: false }))
      return
    }

    if (!checkoutFormState.email) {
      setCheckoutFormState((prev) => ({ ...prev, error: { ...prev.error, email: true }, paymentRequested: false }))
      return
    }

    if (!stripe || !elements) {
      props.addNotification('payment.message.error', 'Stripe not initialized')
      setCheckoutFormState((prev) => ({ ...prev, paymentRequested: false }))
      return
    }

    const cardElement = elements.getElement(CardElement)

    try {
      const { token } = await stripe.createToken(cardElement, { name: checkoutFormState.fullname })

      if (token) {
        props.onPayment({
          id: props.task,
          Orders: {
            source_id: token.id,
            currency: 'usd',
            provider: 'stripe',
            amount: price,
            email: checkoutFormState.email,
            userId: checkoutFormState.userId,
            plan: props.plan
          },
          coupon: couponState.couponApplied ? {
            code: couponState.coupon || null,
            originalOrderPrice: price
          } : null
        })
        props.onClose()
      } else {
        throw new Error('No token received')
      }
    } catch (e) {
      console.log('Error creating token or processing payment:', e)
      props.addNotification('payment.message.error', e.message || 'Error processing payment')
      setCheckoutFormState((prev) => ({ ...prev, paymentRequested: false }))
    }
  }

  const onChange = (ev) => {
    ev.preventDefault()
    setCheckoutFormState((prev) => ({
      ...prev,
      [ev.target.name]: ev.target.value,
      paymentRequested: false
    }))
  }

  useEffect(() => {
    if (user && user.id) {
      setCheckoutFormState((prev) => ({
        ...prev,
        authenticated: true,
        fullname: user.name,
        email: user.email,
        userId: user.id
      }))
    }
  }, [user])

  useEffect(() => {
    setCouponState((prev) => ({ ...prev, couponApplied: false }))
  }, [couponState.couponInput])

  const setCouponApplied = () => {
    if (couponStoreState.completed && Object.keys(couponStoreState.coupon).length > 0) {
      setCouponState((prev) => ({ ...prev, couponApplied: true }))
    }
  }

  const handleCouponApplied = useCallback(() => {
    setCouponApplied()
  }, [couponStoreState])

  useEffect(() => {
    handleCouponApplied()
  }, [handleCouponApplied])

  const showCouponInput = () => {
    setCouponState((prev) => ({ ...prev, couponInput: true }))
  }

  const handleCouponInput = (event) => {
    setCouponState((prev) => ({ ...prev, coupon: event.target.value }))
  }

  const applyCoupon = () => {
    props.validateCoupon(couponState.coupon, price)
  }

  const logged = checkoutFormState.authenticated

  return (
    <form onSubmit={ handleSubmit } onChange={ onChange } style={ { marginTop: 20 } }>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } style={ { marginBottom: 20 } }>
          {logged ? (
            <div>
              <Typography variant="caption">
                <FormattedMessage id="checkout.loggedas" defaultMessage="Logged as" />
              </Typography>
              <Typography variant="body1">
                { `${checkoutFormState.fullname} (${checkoutFormState.email})` }
              </Typography>
            </div>
          ) : (
            <UserSection error={ checkoutFormState.error } />
          )}
        </Grid>

        <Grid item xs={ 12 }>
          <CardSection />
        </Grid>

        <Grid item xs={ 12 }>
          <Coupon
            couponState={ couponState }
            handleCouponInput={ handleCouponInput }
            showCouponInput={ showCouponInput }
            applyCoupon={ applyCoupon }
            couponStoreState={ couponStoreState.coupon }
          />
        </Grid>

        <Grid item xs={ 12 }>
          <div style={ { marginTop: 20, float: 'right' } }>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={ checkoutFormState.paymentRequested || price === 0 }
            >
              <FormattedMessage
                id="checkout.payment.action"
                defaultMessage="Pay {price}"
                values={{
                  price: couponState.couponApplied && couponStoreState.coupon.orderPrice >= 0
                    ? `$${couponStoreState.coupon.orderPrice}`
                    : formatedPrice
                }}
              />
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
  formatedPrice: PropTypes.string,
  user: PropTypes.object,
  plan: PropTypes.string,
  couponStoreState: PropTypes.object,
  validateCoupon: PropTypes.func
}

export default CheckoutForm
