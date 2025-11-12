import { object } from "@paypal/paypal-server-sdk/dist/types/schema";

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
  },
  successfullyWithBountyMetadata: {
    id: "evt_test_refund_bounty",
    object: "event",
    api_version: "2020-03-02",
    created: 1575581460,
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: "req_test_123456789",
      idempotency_key: null
    },
    type: "charge.refunded",
    data: {
      object: {
        "id": "ch_test_bounty_charge",
        "object": "charge",
        "amount": 1840,
        "amount_refunded": 1840,
        "application": null,
        "application_fee": null,
        "application_fee_amount": null,
        "balance_transaction": "txn_test_bounty_balance",
        "billing_details": {
          "address": {
            "city": null,
            "country": null,
            "line1": null,
            "line2": null,
            "postal_code": "00000",
            "state": null
          },
          "email": null,
          "name": "Test User",
          "phone": null
        },
        "captured": true,
        "created": 1571059878,
        "currency": "usd",
        "customer": "cus_test_123",
        "description": null,
        "destination": null,
        "dispute": null,
        "disputed": false,
        "failure_code": null,
        "failure_message": null,
        "fraud_details": {
        },
        "invoice": null,
        "livemode": false,
        "metadata": {
          "order_id": "test-25"
        },
        "on_behalf_of": null,
        "order": null,
        "outcome": {
          "network_status": "approved_by_network",
          "reason": null,
          "risk_level": "normal",
          "risk_score": 58,
          "seller_message": "Payment complete.",
          "type": "authorized"
        },
        "paid": true,
        "payment_intent": null,
        "payment_method": "card_test_123",
        "payment_method_details": {
          "card": {
            "brand": "visa",
            "checks": {
              "address_line1_check": null,
              "address_postal_code_check": "pass",
              "cvc_check": "pass"
            },
            "country": "US",
            "exp_month": 4,
            "exp_year": 2024,
            "fingerprint": "test_fingerprint_123",
            "funding": "credit",
            "installments": null,
            "last4": "4242",
            "network": "visa",
            "three_d_secure": null,
            "wallet": null
          },
          "type": "card"
        },
        "receipt_email": "customer@example.com",
        "receipt_number": null,
        "receipt_url": "https://pay.stripe.com/receipts/test_account/test_charge/rcpt_test",
        "refunded": true,
        "refunds": {
          "object": "list",
          "data": [
            {
              "id": "re_test_bounty_refund",
              "object": "refund",
              "amount": 1840,
              "balance_transaction": "txn_test_bounty_refund",
              "charge": "ch_test_bounty_charge",
              "created": 1575581458,
              "currency": "usd",
              "metadata": {
              },
              "payment_intent": null,
              "reason": "requested_by_customer",
              "receipt_number": null,
              "source_transfer_reversal": null,
              "status": "succeeded",
              "transfer_reversal": null
            }
          ],
          "has_more": false,
          "total_count": 1,
          "url": "/v1/charges/ch_test_bounty_charge/refunds"
        },
        "review": null,
        "shipping": null,
        "source": {
          "id": "card_test_123",
          "object": "card",
          "address_city": null,
          "address_country": null,
          "address_line1": null,
          "address_line1_check": null,
          "address_line2": null,
          "address_state": null,
          "address_zip": "00000",
          "address_zip_check": "pass",
          "brand": "Visa",
          "country": "US",
          "customer": "cus_test_123",
          "cvc_check": "pass",
          "dynamic_last4": null,
          "exp_month": 4,
          "exp_year": 2024,
          "fingerprint": "test_fingerprint_123",
          "funding": "credit",
          "last4": "4242",
          "metadata": {
          },
          "name": "Test User",
          "tokenization_method": null
        },
        "source_transfer": null,
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "succeeded",
        "transfer_data": null,
        "transfer_group": "task_test_123"
      },
      "previous_attributes": {
        "amount_refunded": 0,
        "refunded": false,
        "refunds": {
          "data": [
          ],
          "total_count": 0
        }
      }
    }
  }
};
