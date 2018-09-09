module.exports.update = {
  "id": "evt_1CcecMBrSjgsps2DMFZw5Tyx",
  "object": "event",
  "api_version": "2018-02-28",
  "created": 1528918014,
  "data": {
    "object": {
      "id": "ch_1CcdmsBrSjgsps2DNZiZAyvG",
      "object": "charge",
      "amount": 2000,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "balance_transaction": "txn_1CcdmtBrSjgsps2DZ8fgy0l3",
      "captured": true,
      "created": 1528914822,
      "currency": "usd",
      "customer": "cus_CyvwcNX1GNZYpi",
      "description": null,
      "destination": null,
      "dispute": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {},
      "invoice": null,
      "livemode": true,
      "metadata": {
        "order_id": "5"
      },
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "receipt_email": "alexanmtz@gmail.com",
      "receipt_number": "1493-4227",
      "refunded": false,
      "refunds": {
        "object": "list",
        "data": [],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_1CcdmsBrSjgsps2DNZiZAyvG/refunds"
      },
      "review": null,
      "shipping": null,
      "source": {
        "id": "card_1CcdmoBrSjgsps2Dw7RRQDwp",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "MasterCard",
        "country": "BR",
        "customer": "cus_CyvwcNX1GNZYpi",
        "cvc_check": "pass",
        "dynamic_last4": null,
        "exp_month": 1,
        "exp_year": 2026,
        "fingerprint": "tzay8tdiaGOR9jgB",
        "funding": "credit",
        "last4": "3670",
        "metadata": {},
        "name": "Alexandre Magno",
        "tokenization_method": null
      },
      "source_transfer": null,
      "statement_descriptor": null,
      "status": "succeeded",
      "transfer_group": "task_23"
    },
    "previous_attributes": {
      "receipt_email": null,
      "receipt_number": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_7JDHTJnTPulDSK",
    "idempotency_key": null
  },
  "type": "charge.updated"
}

module.exports.success = {
  "id": "evt_1CeLZlBrSjgsps2DYpOlFCuW",
  "object": "event",
  "api_version": "2018-02-28",
  "created": 1529321473,
  "data": {
    "object": {
      "id": "ch_1CeLZkBrSjgsps2DCNBQmnLA",
      "object": "charge",
      "amount": 500,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "balance_transaction": "txn_1CeLZlBrSjgsps2DYNYEZqhs",
      "captured": true,
      "created": 1529321472,
      "currency": "usd",
      "customer": "cus_CyvwcNX1GNZYpi",
      "description": null,
      "destination": null,
      "dispute": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {
      },
      "invoice": null,
      "livemode": true,
      "metadata": {
        "order_id": "7"
      },
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "receipt_email": null,
      "receipt_number": null,
      "refunded": false,
      "refunds": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_1CeLZkBrSjgsps2DCNBQmnLA/refunds"
      },
      "review": null,
      "shipping": null,
      "source": {
        "id": "card_1CeLZgBrSjgsps2D46GUqEBB",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "Visa",
        "country": "DK",
        "customer": "cus_CyvwcNX1GNZYpi",
        "cvc_check": "pass",
        "dynamic_last4": null,
        "exp_month": 10,
        "exp_year": 2019,
        "fingerprint": "qwJTFcMNAfCltmXY",
        "funding": "debit",
        "last4": "7743",
        "metadata": {
        },
        "name": "Alexandre Magno",
        "tokenization_method": null
      },
      "source_transfer": null,
      "statement_descriptor": null,
      "status": "succeeded",
      "transfer_group": "task_25"
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_a3oEDW4y0pfI9z",
    "idempotency_key": null
  },
  "type": "charge.succeeded"
}

module.exports.failed = {
  "id": "evt_1D8FHCBrSjgsps2DKkdcPqfg",
  "object": "event",
  "api_version": "2018-02-28",
  "created": 1536447098,
  "data": {
    "object": {
      "id": "ch_1D8FHBBrSjgsps2DJawS1hYk",
      "object": "charge",
      "amount": 500,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "balance_transaction": null,
      "captured": false,
      "created": 1536447097,
      "currency": "usd",
      "customer": "cus_DZO39yqDQgQt1O",
      "description": null,
      "destination": null,
      "dispute": null,
      "failure_code": "card_declined",
      "failure_message": "Your card was declined.",
      "fraud_details": {
        "stripe_report": "fraudulent"
      },
      "invoice": null,
      "livemode": true,
      "metadata": {
        "order_id": "47"
      },
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "network_status": "not_sent_to_network",
        "reason": "highest_risk_level",
        "risk_level": "highest",
        "rule": "block_if_high_risk__enabled",
        "seller_message": "Stripe blocked this payment as too risky.",
        "type": "blocked"
      },
      "paid": false,
      "receipt_email": null,
      "receipt_number": null,
      "refunded": false,
      "refunds": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_1D8FHBBrSjgsps2DJawS1hYk/refunds"
      },
      "review": null,
      "shipping": null,
      "source": {
        "id": "card_1D8FH6BrSjgsps2DtehhSR4l",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "Visa",
        "country": "BR",
        "customer": "cus_DZO39yqDQgQt1O",
        "cvc_check": "unavailable",
        "dynamic_last4": null,
        "exp_month": 1,
        "exp_year": 2026,
        "fingerprint": "iguypZWj2UjRVNCv",
        "funding": "credit",
        "last4": "1017",
        "metadata": {
        },
        "name": "mthais",
        "tokenization_method": null
      },
      "source_transfer": null,
      "statement_descriptor": null,
      "status": "failed",
      "transfer_group": "task_65"
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_TJZ6NnHw55910F",
    "idempotency_key": null
  },
  "type": "charge.failed"
}
