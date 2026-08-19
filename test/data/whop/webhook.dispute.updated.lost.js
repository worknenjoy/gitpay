module.exports = {
  disputeUpdatedLost: {
    id: 'msg_whop_dispute_updated_lost_1',
    api_version: 'v1',
    type: 'dispute.updated',
    timestamp: '2026-06-05T10:00:00.000Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'disp_test_1',
      amount: 49.95,
      currency: 'usd',
      status: 'lost',
      reason: 'product_not_received',
      created_at: '2026-06-01T09:58:00.000Z',
      payment: { id: 'pay_whop_dispute_1' },
      customer_name: 'Test Customer',
      customer_email_address: 'customer@example.com'
    }
  }
}
