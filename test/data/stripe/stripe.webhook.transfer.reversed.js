module.exports = {
  success: {
    id: 'evt_test_00000000000000',
    object: 'event',
    api_version: '2020-03-02',
    created: 1609459200,
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: 'test-idempotency-key'
    },
    type: 'transfer.reversed',
    data: {
      object: {
        id: 'tr_test_00000000000000',
        object: 'transfer',
        amount: 4596,
        amount_reversed: 4596,
        balance_transaction: 'txn_test_00000000000000',
        created: 1609455600,
        currency: 'usd',
        description: 'Test payment for service using Payment Request id: 67',
        destination: 'acct_test_123456789',
        destination_payment: 'py_test_00000000000000',
        livemode: false,
        metadata: {
          payment_request_id: '1',
          user_id: '1'
        },
        reversals: {
          object: 'list',
          data: [
            {
              id: 'trr_test_00000000000000',
              object: 'transfer_reversal',
              amount: 4596,
              balance_transaction: 'txn_test_11111111111111',
              created: 1609462800,
              currency: 'usd',
              destination_payment_refund: 'pyr_test_00000000000000',
              metadata: {},
              source_refund: null,
              transfer: 'tr_test_00000000000000'
            }
          ],
          has_more: false,
          total_count: 1,
          url: '/v1/transfers/tr_test_00000000000000/reversals'
        },
        reversed: true,
        source_transaction: null,
        source_type: 'card',
        transfer_group: 'group_test_00000000000000'
      },
      previous_attributes: {
        amount_reversed: 0,
        reversals: {
          data: [],
          total_count: 0
        },
        reversed: false
      }
    }
  }
}
