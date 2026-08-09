module.exports = {
  success: {
    id: 'msg_whop_pr_1',
    api_version: 'v1',
    type: 'payment.succeeded',
    timestamp: '2026-05-12T18:42:11.041Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'pay_whop_pr_1',
      status: 'succeeded',
      amount_after_fees: 92,
      total: 100,
      currency: 'usd',
      metadata: {
        payment_request_id: null, // filled by test or use plan id match
        purpose: 'payment_request',
        payment_link_id: 'plan_test_whop_pr'
      },
      user: { name: 'Customer', email: 'customer@example.com' }
    }
  }
}
