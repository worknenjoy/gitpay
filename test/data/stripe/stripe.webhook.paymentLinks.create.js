module.exports.create = {
  success: {
    id: 'evt_1Q2fklBrSjgsps2Dx0mEXsXv',
    object: 'event',
    api_version: '2020-03-02',
    created: 1727211273,
    data: {
      object: {
        id: 'plink_1RcnYCBrSjgsps2DsAPjr1km',
        object: 'payment_link',
        active: true,
        after_completion: {
          hosted_confirmation: {
            custom_message: null
          },
          type: 'hosted_confirmation'
        },
        allow_promotion_codes: false,
        application: null,
        application_fee_amount: null,
        application_fee_percent: null,
        automatic_tax: {
          enabled: false,
          liability: null
        },
        billing_address_collection: 'auto',
        consent_collection: null,
        currency: 'usd',
        custom_fields: [],
        custom_text: {
          after_submit: null,
          shipping_address: null,
          submit: null,
          terms_of_service_acceptance: null
        },
        customer_creation: 'if_required',
        inactive_message: null,
        invoice_creation: {
          enabled: false,
          invoice_data: {
            account_tax_ids: null,
            custom_fields: null,
            description: null,
            footer: null,
            issuer: null,
            metadata: {},
            rendering_options: null
          }
        },
        livemode: false,
        metadata: {},
        on_behalf_of: null,
        payment_intent_data: null,
        payment_method_collection: 'always',
        payment_method_types: null,
        phone_number_collection: {
          enabled: false
        },
        restrictions: null,
        shipping_address_collection: null,
        shipping_options: [],
        submit_type: 'auto',
        subscription_data: null,
        tax_id_collection: {
          enabled: false,
          required: 'never'
        },
        transfer_data: null,
        url: 'https://buy.stripe.com/test_6oU14m1Nb0XZ3MDaAtdwc04'
      }
    }
  }
}
