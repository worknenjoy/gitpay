module.exports.created = {
  id: 'evt_test_123',
  object: 'event',
  api_version: '2018-02-28',
  created: 1528918014,
  data: {
    object: {
      id: 'tr_test_123',
      object: 'transfer',
      amount: 100,
      amount_reversed: 0,
      balance_transaction: 'txn_test_123',
      created: 1528825772,
      currency: 'usd',
      description: null,
      destination: 'acct_test_123',
      destination_payment: 'py_test_123',
      livemode: false,
      metadata: {},
      reversals: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/transfers/tr_test_123/reversals'
      },
      reversed: false,
      source_transaction: null,
      source_type: 'card',
      transfer_group: 'task_test_1'
    },
    previous_attributes: null
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_123',
    idempotency_key: null
  },
  type: 'transfer.created'
}

module.exports.createdFromPaymentRequest = {
  id: 'evt_test_456',
  object: 'event',
  api_version: '2018-02-28',
  created: 1528918014,
  data: {
    object: {
      id: 'tr_test_456',
      object: 'transfer',
      amount: 1000,
      amount_reversed: 0,
      balance_transaction: 'txn_test_456',
      created: 1751094857,
      currency: 'usd',
      description: 'Payment for service using Payment Request id: test_2',
      destination: 'acct_test_456',
      destination_payment: 'py_test_456',
      livemode: false,
      metadata: {
        payment_request_id: '1',
        user_id: '1'
      },
      reversals: {
        object: 'list',
        data: [],
        has_more: false,
        total_count: 0,
        url: '/v1/transfers/tr_test_456/reversals'
      },
      reversed: false,
      source_transaction: null,
      source_type: 'card',
      transfer_group: null
    },
    previous_attributes: null
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_456',
    idempotency_key: null
  },
  type: 'transfer.created'
}
