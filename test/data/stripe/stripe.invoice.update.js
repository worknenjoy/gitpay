module.exports.updated = {
  id: 'evt_1CcecMBrSjgsps2DMFZw5Tyx',
  object: 'event',
  api_version: '2018-02-28',
  created: 1528918014,
  data: {
    object: {
      id: 'in_1Il9COBrSjgsps2DtvLrFalB',
      object: 'invoice',
      account_country: 'US',
      account_name: 'worknenjoy, Inc.',
      account_tax_ids: null,
      amount_due: 7080,
      amount_paid: 7080,
      amount_remaining: 0,
      application_fee_amount: null,
      attempt_count: 1,
      attempted: true,
      auto_advance: false,
      billing_reason: 'manual',
      charge: 'ch_1IlAjBBrSjgsps2DLjTdMXwJ',
      collection_method: 'send_invoice',
      created: 1619600208,
      currency: 'usd',
      custom_fields: null,
      customer: 'cus_CyvwcNX1GNZYpi',
      customer_address: null,
      customer_email: 'veridiana.reis@hotmail.com',
      customer_name: 'Veridiana Reis',
      customer_phone: null,
      customer_shipping: {
        address: {
          city: '',
          country: '',
          line1: '',
          line2: '',
          postal_code: '',
          state: ''
        },
        name: 'Veridiana Reis',
        phone: ''
      },
      customer_tax_exempt: 'none',
      customer_tax_ids: [],
      default_payment_method: null,
      default_source: null,
      default_tax_rates: [],
      description: null,
      discount: null,
      discounts: [],
      due_date: 1622192899,
      ending_balance: 0,
      footer: null,
      hosted_invoice_url:
        'https://invoice.stripe.com/i/acct_19qSWHBrSjgsps2D/invst_JNv2LdOdh1Rvw5uqVfwVxYbRVV5qXTK',
      invoice_pdf:
        'https://pay.stripe.com/invoice/acct_19qSWHBrSjgsps2D/invst_JNv2LdOdh1Rvw5uqVfwVxYbRVV5qXTK/pdf',
      last_finalization_error: null,
      lines: {
        object: 'list',
        data: [
          {
            id: 'il_1Il9COBrSjgsps2DjKPPjVgD',
            object: 'line_item',
            amount: 7080,
            currency: 'usd',
            description: 'Development service for a task on Gitpay: https://gitpay.me/#/task/452',
            discount_amounts: [],
            discountable: true,
            discounts: [],
            invoice_item: 'ii_1Il9COBrSjgsps2DjqLhtqBE',
            livemode: true,
            metadata: {
              task_id: '452'
            },
            period: {
              end: 1619600208,
              start: 1619600208
            },
            plan: null,
            price: {
              id: 'price_1Il9COBrSjgsps2DaXQ1XX4q',
              object: 'price',
              active: false,
              billing_scheme: 'per_unit',
              created: 1619600208,
              currency: 'usd',
              livemode: true,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: 'prod_JNv2Q5QUzoe5Fi',
              recurring: null,
              tiers_mode: null,
              transform_quantity: null,
              type: 'one_time',
              unit_amount: 7080,
              unit_amount_decimal: '7080'
            },
            proration: false,
            quantity: 1,
            subscription: null,
            tax_amounts: [],
            tax_rates: [],
            type: 'invoiceitem'
          }
        ],
        has_more: false,
        total_count: 1,
        url: '/v1/invoices/in_1Il9COBrSjgsps2DtvLrFalB/lines'
      },
      livemode: true,
      metadata: {
        task_id: '452'
      },
      next_payment_attempt: null,
      number: 'AD894E6-0003',
      on_behalf_of: null,
      paid: true,
      payment_intent: 'pi_1Il9NYBrSjgsps2DeYFzkJLY',
      payment_settings: {
        payment_method_options: null,
        payment_method_types: null
      },
      period_end: 1619600208,
      period_start: 1619600208,
      post_payment_credit_notes_amount: 0,
      pre_payment_credit_notes_amount: 0,
      receipt_number: '2532-2134',
      starting_balance: 0,
      statement_descriptor: null,
      status: 'paid',
      status_transitions: {
        finalized_at: 1619600899,
        marked_uncollectible_at: null,
        paid_at: 1619606087,
        voided_at: null
      },
      subscription: null,
      subtotal: 7080,
      tax: null,
      tax_percent: null,
      total: 7080,
      total_discount_amounts: [],
      total_tax_amounts: [],
      transfer_data: null,
      webhooks_delivered_at: 1619600208
    },
    previous_attributes: {
      amount_paid: 0,
      amount_remaining: 7080,
      attempt_count: 0,
      attempted: false,
      auto_advance: true,
      charge: null,
      paid: false,
      receipt_number: null,
      status: 'open',
      status_transitions: {
        paid_at: null
      }
    },
    previous_attributes: null
  },
  livemode: true,
  pending_webhooks: 1,
  request: {
    id: 'req_7JDHTJnTPulDSK',
    idempotency_key: null
  },
  type: 'invoice.updated'
}
