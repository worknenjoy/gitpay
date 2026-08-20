module.exports = {
  disputeAlertChargeable: {
    id: 'msg_whop_dispute_alert_1',
    api_version: 'v1',
    type: 'dispute_alert.created',
    timestamp: '2026-06-08T10:00:00.000Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'dpal_test_1',
      alert_type: 'dispute_rdr',
      amount: 49.95,
      charge_for_alert: true,
      currency: 'usd',
      created_at: '2026-06-08T09:58:00.000Z',
      payment: {
        id: 'pay_whop_alert_1',
        user: { name: 'Test Customer', email: 'customer@example.com' }
      }
    }
  },
  disputeAlertFree: {
    id: 'msg_whop_dispute_alert_2',
    api_version: 'v1',
    type: 'dispute_alert.created',
    timestamp: '2026-06-08T10:05:00.000Z',
    company_id: 'biz_test_platform',
    data: {
      id: 'dpal_test_2',
      alert_type: 'fraud',
      amount: 49.95,
      charge_for_alert: false,
      currency: 'usd',
      created_at: '2026-06-08T10:03:00.000Z',
      payment: {
        id: 'pay_whop_alert_1',
        user: { name: 'Test Customer', email: 'customer@example.com' }
      }
    }
  }
}
