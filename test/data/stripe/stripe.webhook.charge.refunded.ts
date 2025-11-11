export const refundCreated = {
  successfully: {
    id: "evt_1TestChargeRefunded",
    object: "event",
    api_version: "2020-03-02",
    created: 1762903161,
    data: {
      object: {
        id: "ch_1TestCharge",
        object: "charge",
        amount: 1495,
        amount_captured: 1495,
        amount_refunded: 1495,
        amount_updates: [],
        application: null,
        application_fee: null,
        application_fee_amount: null,
        balance_transaction: "txn_1TestBalance",
        billing_details: {
          address: {
            city: "Test City",
            country: "US",
            line1: "123 Test St",
            line2: "Suite 100",
            postal_code: "94105",
            state: "CA"
          },
          email: "customer@example.com",
          name: "Test User",
          phone: null,
          tax_id: null
        },
        calculated_statement_descriptor: "EXAMPLE.COM",
        captured: true,
        created: 1762896896,
        currency: "usd",
        customer: null,
        description: null,
        destination: null,
        dispute: null,
        disputed: false,
        failure_balance_transaction: null,
        failure_code: null,
        failure_message: null,
        fraud_details: {},
        invoice: null,
        livemode: false,
        metadata: {},
        on_behalf_of: null,
        order: null,
        outcome: {
          advice_code: null,
          network_advice_code: null,
          network_decline_code: null,
          network_status: "approved_by_network",
          reason: null,
          risk_level: "normal",
          seller_message: "Payment complete.",
          type: "authorized"
        },
        paid: true,
        payment_intent: "pi_1TestPI",
        payment_method: "pm_1TestPM",
        payment_method_details: {
          card: {
            amount_authorized: 1495,
            authorization_code: "AUTH123",
            brand: "visa",
            checks: {
              address_line1_check: "pass",
              address_postal_code_check: "pass",
              cvc_check: "pass"
            },
            country: "US",
            exp_month: 6,
            exp_year: 2031,
            extended_authorization: {
              status: "disabled"
            },
            fingerprint: "test_fingerprint_123",
            funding: "credit",
            incremental_authorization: {
              status: "unavailable"
            },
            installments: null,
            last4: "4242",
            mandate: null,
            multicapture: {
              status: "unavailable"
            },
            network: "visa",
            network_token: {
              used: false
            },
            network_transaction_id: "test_nti_123",
            overcapture: {
              maximum_amount_capturable: 1495,
              status: "unavailable"
            },
            regulated_status: "unregulated",
            three_d_secure: null,
            wallet: {
              apple_pay: {
                type: "apple_pay"
              },
              dynamic_last4: "4242",
              type: "apple_pay"
            }
          },
          type: "card"
        },
        radar_options: {},
        receipt_email: "customer@example.com",
        receipt_number: "0000-0000",
        receipt_url: "https://pay.stripe.com/receipts/test_receipt_charge",
        refunded: true,
        refunds: {
          object: "list",
          data: [
            {
              id: "re_1TestRefund",
              object: "refund",
              amount: 1495,
              balance_transaction: "txn_1TestRefund",
              charge: "ch_1TestCharge",
              created: 1762903160,
              currency: "usd",
              destination_details: {
                card: {
                  type: "pending"
                },
                type: "card"
              },
              metadata: {},
              payment_intent: "pi_1TestPI",
              reason: "requested_by_customer",
              receipt_number: "1111-1111",
              source_transfer_reversal: null,
              status: "succeeded",
              transfer_reversal: null
            }
          ],
          has_more: false,
          total_count: 1,
          url: "/v1/charges/ch_1TestCharge/refunds"
        },
        review: null,
        shipping: null,
        source: null,
        source_transfer: null,
        statement_descriptor: null,
        statement_descriptor_suffix: null,
        status: "succeeded",
        transfer_data: null,
        transfer_group: null
      },
      previous_attributes: {
        amount_refunded: 0,
        receipt_url: "https://pay.stripe.com/receipts/test_receipt_prev",
        refunded: false,
        refunds: {
          data: [],
          total_count: 0
        }
      }
    },
    livemode: false,
    pending_webhooks: 2,
    request: {
      id: "req_test_123",
      idempotency_key: "00000000-0000-0000-0000-000000000000"
    },
    type: "charge.refunded"
  }
};
