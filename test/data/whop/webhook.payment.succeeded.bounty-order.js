module.exports = {
  success: {
    id: 'msg_whop_order_1',
    api_version: 'v1',
    type: 'payment.succeeded',
    timestamp: '2026-05-12T18:42:11.041Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'pay_whop_order_1',
      status: 'succeeded',
      amount_after_fees: 10,
      total: 10.8,
      currency: 'usd',
      metadata: {
        order_id: null, // set in test
        task_id: null,
        purpose: 'bounty_order'
      }
    }
  }
}
