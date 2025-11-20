module.exports.resource_not_found = {
  name: 'RESOURCE_NOT_FOUND',
  details: [
    {
      issue: 'INVALID_RESOURCE_ID',
      description:
        'Specified resource ID does not exist. Please check the resource ID and try again.',
    },
  ],
  message: 'The specified resource does not exist.',
  debug_id: '1c21fae7e5989',
  links: [
    {
      href: 'https://developer.paypal.com/docs/api/orders/v2/#error-INVALID_RESOURCE_ID',
      rel: 'information_link',
      method: 'GET',
    },
  ],
}

module.exports.authorization_expired = {
  id: 'TEST_ORDER_ID',
  intent: 'AUTHORIZE',
  status: 'COMPLETED',
  payment_source: {
    paypal: {
      email_address: 'test@example.com',
      account_id: 'TESTACCOUNTID',
      account_status: 'VERIFIED',
      name: {},
      address: {},
    },
  },
  purchase_units: [
    {
      reference_id: 'default',
      amount: {},
      payee: {},
      description: 'Development services provided by Gitpay',
      soft_descriptor: 'PAYPAL *WORKNENJOY',
      shipping: {},
      payments: {
        authorizations: [
          {
            status: 'VOIDED',
            id: 'TEST_AUTH_ID',
            amount: { currency_code: 'USD', value: '32.00' },
            seller_protection: {
              status: 'ELIGIBLE',
              dispute_categories: ['ITEM_NOT_RECEIVED', 'UNAUTHORIZED_TRANSACTION'],
            },
            expiration_time: '2025-06-28T07:52:46Z',
            links: [
              {
                href: 'https://api.sandbox.paypal.com/v2/payments/authorizations/TEST_AUTH_ID',
                rel: 'self',
                method: 'GET',
              },
              {
                href: 'https://api.sandbox.paypal.com/v2/payments/authorizations/TEST_AUTH_ID/capture',
                rel: 'capture',
                method: 'POST',
              },
              {
                href: 'https://api.sandbox.paypal.com/v2/payments/authorizations/TEST_AUTH_ID/void',
                rel: 'void',
                method: 'POST',
              },
              {
                href: 'https://api.sandbox.paypal.com/v2/checkout/orders/TEST_ORDER_ID',
                rel: 'up',
                method: 'GET',
              },
            ],
            create_time: '2025-05-30T07:52:46Z',
            update_time: '2025-06-28T07:53:19Z',
          },
        ],
      },
    },
  ],
  payer: {
    name: { given_name: 'Test', surname: 'User' },
    email_address: 'test@example.com',
    payer_id: 'TESTPAYERID',
    address: { country_code: 'US' },
  },
  create_time: '2025-05-30T07:52:30Z',
  update_time: '2025-05-30T07:52:46Z',
  links: [
    {
      href: 'https://api.sandbox.paypal.com/v2/checkout/orders/TEST_ORDER_ID',
      rel: 'self',
      method: 'GET',
    },
  ],
}
