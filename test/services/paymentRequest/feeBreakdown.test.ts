import { expect } from 'chai'
import { computePaymentFeeBreakdown } from '../../../src/services/paymentRequest/feeBreakdown'

describe('computePaymentFeeBreakdown', () => {
  const directChargePr = {
    amount: 100,
    custom_amount: false,
    provider: 'whop',
    platform_fee_percent: '5.00'
  }

  it('splits a direct charge into Whop processing + platform fee from Whop-reported values', () => {
    const result = computePaymentFeeBreakdown({
      paymentRequestPayment: {
        amount: 100,
        amount_after_fees: 89.63,
        provider_fee_amount: 5,
        destination_account_id: 'biz_submerchant_1'
      },
      paymentRequest: directChargePr,
      currency: 'usd'
    })

    expect(result).to.deep.equal({
      gross: 100,
      processingFee: 5.37,
      platformFee: 5,
      platformFeePercent: 5,
      net: 89.63,
      directCharge: true
    })
  })

  it('derives the direct-charge platform fee from the snapshotted rate when Whop did not echo it', () => {
    const result = computePaymentFeeBreakdown({
      paymentRequestPayment: {
        amount: 100,
        amount_after_fees: 89.63,
        provider_fee_amount: null,
        destination_account_id: 'biz_submerchant_1'
      },
      paymentRequest: directChargePr,
      currency: 'usd'
    })

    expect(result.platformFee).to.equal(5)
    expect(result.processingFee).to.equal(5.37)
    expect(result.net).to.equal(89.63)
  })

  it("leaves net and processing fee unknown for a direct charge awaiting Whop's net", () => {
    const result = computePaymentFeeBreakdown({
      paymentRequestPayment: {
        amount: 100,
        amount_after_fees: null,
        destination_account_id: 'biz_submerchant_1'
      },
      paymentRequest: directChargePr,
      currency: 'usd'
    })

    expect(result.net).to.equal(null)
    expect(result.processingFee).to.equal(null)
    expect(result.platformFee).to.equal(5)
  })

  it('applies the platform fee after the processor cut for a platform (non-direct) Whop payment', () => {
    const result = computePaymentFeeBreakdown({
      paymentRequestPayment: { amount: 100, amount_after_fees: 94.37 },
      paymentRequest: {
        amount: 100,
        custom_amount: false,
        provider: 'whop',
        platform_fee_percent: 8
      },
      currency: 'usd'
    })

    expect(result).to.deep.equal({
      gross: 100,
      processingFee: 5.63,
      platformFee: 7.55,
      platformFeePercent: 8,
      net: 86.82,
      directCharge: false
    })
  })

  it('has no processing fee row for Stripe (no reported net)', () => {
    const result = computePaymentFeeBreakdown({
      paymentRequestPayment: { amount: 20, amount_after_fees: null },
      paymentRequest: {
        amount: 20,
        custom_amount: false,
        provider: 'stripe',
        platform_fee_percent: 8
      },
      currency: 'usd'
    })

    expect(result.processingFee).to.equal(null)
    expect(result.platformFee).to.equal(1.6)
    expect(result.net).to.equal(18.4)
  })
})
