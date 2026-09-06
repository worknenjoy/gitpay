import { expect } from 'chai'
import { computeSellerNetAmount } from '../../../src/services/paymentRequest/sellerNetAmount'

describe('computeSellerNetAmount', () => {
  it('applies Gitpay\'s 8% cut on top of Whop\'s reported net for a legacy (transfer) payment', () => {
    const result = computeSellerNetAmount({
      paymentRequestPayment: {
        amount: 20,
        amount_after_fees: 17.03
      },
      paymentRequest: {
        amount: 20,
        custom_amount: false,
        provider: 'whop'
      },
      currency: 'usd'
    })

    expect(result.originalAmountDecimal).to.equal(17.03)
    // 17.03 * 0.92 = 15.6676, rounds to 15.67 — legacy transfer/refund math, unchanged.
    expect(result.netAmountDecimal).to.equal(15.67)
  })

  it('does not apply a second 8% cut for a direct-charge payment — Whop already deducted it via application_fee_amount', () => {
    // Real numbers from a Whop sandbox test: $20 charge, fees totaled $2.97
    // (including a $1.60 application fee), leaving $17.03 as amount_after_fees.
    // Before the fix this returned 15.67 (17.03 * 0.92), double-charging the
    // commission and leaving $1.36 stranded on the seller's connected company after
    // a full refund.
    const result = computeSellerNetAmount({
      paymentRequestPayment: {
        amount: 20,
        amount_after_fees: 17.03,
        destination_account_id: 'biz_submerchant_1'
      },
      paymentRequest: {
        amount: 20,
        custom_amount: false,
        provider: 'whop'
      },
      currency: 'usd'
    })

    expect(result.originalAmountDecimal).to.equal(17.03)
    expect(result.netAmountDecimal).to.equal(17.03)
    expect(result.netAmountCents).to.equal(1703)
  })

  it('still applies the 8% cut for a direct-charge payment when amount_after_fees is not yet known', () => {
    // No confirmed Whop-reported net to trust yet — falls back to the gross amount,
    // same as the legacy path, since we can't tell what Whop already deducted.
    const result = computeSellerNetAmount({
      paymentRequestPayment: {
        amount: 20,
        amount_after_fees: null,
        destination_account_id: 'biz_submerchant_1'
      },
      paymentRequest: {
        amount: 20,
        custom_amount: false,
        provider: 'whop'
      },
      currency: 'usd'
    })

    expect(result.originalAmountDecimal).to.equal(20)
    expect(result.netAmountDecimal).to.equal(18.4)
  })

  it('is unaffected by destination_account_id for a Stripe payment', () => {
    const result = computeSellerNetAmount({
      paymentRequestPayment: {
        amount: 20,
        amount_after_fees: null,
        destination_account_id: null
      },
      paymentRequest: {
        amount: 20,
        custom_amount: false,
        provider: 'stripe'
      },
      currency: 'usd'
    })

    expect(result.originalAmountDecimal).to.equal(20)
    expect(result.netAmountDecimal).to.equal(18.4)
  })
})
