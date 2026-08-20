module.exports = {
  refundCreated: {
    id: 'msg_whop_refund_created_1',
    api_version: 'v1',
    type: 'refund.created',
    timestamp: '2026-06-02T10:00:00.000Z',
    company_id: 'biz_test_platform',
    data: {
      id: 're_whop_test_1',
      amount: 49.95,
      currency: 'usd',
      status: 'succeeded',
      payment: { id: 'pay_whop_refund_1' }
    }
  }
}
