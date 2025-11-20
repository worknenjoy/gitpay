import React from 'react'
import Coupon from './coupon'

export default {
  title: 'Design Library/Molecules/FormSection/CouponForm',
  component: Coupon,
}

const Template = (args) => <Coupon {...args} />

export const Default = Template.bind({})
Default.args = {
  couponState: {
    coupon: '',
    couponApplied: false,
    couponInput: false,
  },
  handleCouponInput: () => {},
  showCouponInput: () => {},
  applyCoupon: () => {},
  couponStoreState: {
    amount: 0,
    orderPrice: 0,
  },
}
