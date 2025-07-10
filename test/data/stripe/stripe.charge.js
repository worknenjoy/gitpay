module.exports.get = {
  "id": "ch_123",
  "object": "charge",
  "amount": 10800,
  "amount_captured": 10800,
  "amount_refunded": 0,
  "amount_updates": [
  ],
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_123",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": "XXXXXX",
      "state": null
    },
    "email": null,
    "name": "Foo Bar",
    "phone": null
  },
  "calculated_statement_descriptor": "GITPAY.ME",
  "captured": true,
  "created": 1719694573,
  "currency": "usd",
  "customer": "cus_123",
  "description": null,
  "destination": null,
  "dispute": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {
  },
  "invoice": null,
  "livemode": true,
  "metadata": {
    "order_id": "1"
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
  "payment_intent": null,
  "payment_method": "card_123",
  "payment_method_details": {
    "card": {
      "amount_authorized": 10800,
      "brand": "amex",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": "pass",
        "cvc_check": "pass"
      },
      "country": "GB",
      "exp_month": 1,
      "exp_year": 2028,
      "extended_authorization": {
        "status": "disabled"
      },
      "fingerprint": "xxxxx",
      "funding": "credit",
      "incremental_authorization": {
        "status": "unavailable"
      },
      "installments": null,
      "last4": "2003",
      "mandate": null,
      "multicapture": {
        "status": "unavailable"
      },
      "network": "amex",
      "network_token": {
        "used": false
      },
      "overcapture": {
        "maximum_amount_capturable": 10800,
        "status": "unavailable"
      },
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": "foo@example.com",
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/xxxxxxxx",
  "refunded": false,
  "review": null,
  "shipping": null,
  "source": {
    "id": "card_123",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": "ZZZZZZ",
    "address_zip_check": "pass",
    "brand": "American Express",
    "country": "GB",
    "customer": "cus_123",
    "cvc_check": "pass",
    "dynamic_last4": null,
    "exp_month": 1,
    "exp_year": 2028,
    "fingerprint": "xxxxx",
    "funding": "credit",
    "last4": "123",
    "metadata": {
    },
    "name": "Foo Bar",
    "tokenization_method": null,
    "wallet": null
  },
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": "task_1"
}