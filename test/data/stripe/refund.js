module.exports.refund = {
    "object": {
      "id": "ch_1FTTdqBrSjgsps2DQjHwwqr4",
      "object": "charge",
      "amount": 1840,
      "amount_refunded": 1840,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": "txn_1FTTdqBrSjgsps2DDJJYNcCt",
      "billing_details": {
        "address": {
          "city": null,
          "country": null,
          "line1": null,
          "line2": null,
          "postal_code": "22631",
          "state": null
        },
        "email": null,
        "name": "Alexandre Magno Teles Zimerer",
        "phone": null
      },
      "captured": true,
      "created": 1571059878,
      "currency": "usd",
      "customer": "cus_Ec8ZOuHXnSlBh8",
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
        "order_id": "25"
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
      "payment_method": "card_1FTTdSBrSjgsps2DFfBwigSm",
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
          "fingerprint": "hOvGlPES37z4bEHC",
          "funding": "credit",
          "installments": null,
          "last4": "4242",
          "network": "visa",
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "receipt_email": "alz@worknenjoy.com",
      "receipt_number": null,
      "receipt_url": "https://pay.stripe.com/receipts/acct_19qSWHBrSjgsps2D/ch_1FTTdqBrSjgsps2DQjHwwqr4/rcpt_FzSY3TBeomTTASdrJcgZUIvEx8iFfsW",
      "refunded": true,
      "refunds": {
        "object": "list",
        "data": [
          {
            "id": "re_1FmRuYBrSjgsps2D9HBiPjC8",
            "object": "refund",
            "amount": 1840,
            "balance_transaction": "txn_1FmRuYBrSjgsps2D2kXcBYsC",
            "charge": "ch_1FTTdqBrSjgsps2DQjHwwqr4",
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
        "url": "/v1/charges/ch_1FTTdqBrSjgsps2DQjHwwqr4/refunds"
      },
      "review": null,
      "shipping": null,
      "source": {
        "id": "card_1FTTdSBrSjgsps2DFfBwigSm",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": "22631",
        "address_zip_check": "pass",
        "brand": "Visa",
        "country": "US",
        "customer": "cus_Ec8ZOuHXnSlBh8",
        "cvc_check": "pass",
        "dynamic_last4": null,
        "exp_month": 4,
        "exp_year": 2024,
        "fingerprint": "hOvGlPES37z4bEHC",
        "funding": "credit",
        "last4": "4242",
        "metadata": {
        },
        "name": "Alexandre Magno Teles Zimerer",
        "tokenization_method": null
      },
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": "task_33"
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