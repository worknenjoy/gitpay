module.exports = {
  disputeCreated: {
    id: 'msg_whop_dispute_created_1',
    api_version: 'v1',
    type: 'dispute.created',
    timestamp: '2026-06-01T10:00:00.000Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'disp_test_1',
      amount: 49.95,
      currency: 'usd',
      status: 'needs_response',
      reason: 'product_not_received',
      created_at: '2026-06-01T09:58:00.000Z',
      payment: { id: 'pay_whop_dispute_1' },
      customer_name: 'Test Customer',
      customer_email_address: 'customer@example.com'
    }
  }
}
