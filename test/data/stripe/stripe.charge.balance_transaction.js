module.exports.get = {
  id: 'txn_123',
  object: 'balance_transaction',
  amount: 10800,
  available_on: 1719964800,
  created: 1719694573,
  currency: 'usd',
  description: null,
  exchange_rate: null,
  fee: 505,
  fee_details: [
    {
      amount: 505,
      application: null,
      currency: 'usd',
      description: 'Stripe processing fees',
      type: 'stripe_fee'
    }
  ],
  net: 10295,
  reporting_category: 'charge',
  source: 'ch_123',
  status: 'pending',
  type: 'charge'
}
