export const disputeCreated = {
  "object": {
    "id": "du_test_123",
    "object": "dispute",
    "amount": 4995,
    "balance_transaction": "txn_test_123",
    "balance_transactions": [
      {
        "id": "txn_test_123",
        "object": "balance_transaction",
        "amount": -4995,
        "available_on": 1761968984,
        "balance_type": "payments",
        "created": 1761968984,
        "currency": "usd",
        "description": "Chargeback withdrawal for ch_test_123",
        "exchange_rate": null,
        "fee": 1500,
        "fee_details": [
          {
            "amount": 1500,
            "application": null,
            "currency": "usd",
            "description": "Dispute fee",
            "type": "stripe_fee"
          }
        ],
        "net": -6495,
        "reporting_category": "dispute",
        "source": "du_test_123",
        "status": "available",
        "type": "adjustment"
      }
    ],
    "charge": "ch_test_123",
    "created": 1761968965,
    "currency": "usd",
    "enhanced_eligibility_types": [],
    "evidence": {
      "access_activity_log": null,
      "billing_address": "123 Example Street \nExample City, EX 12345, US",
      "cancellation_policy": null,
      "cancellation_policy_disclosure": null,
      "cancellation_rebuttal": null,
      "customer_communication": null,
      "customer_email_address": "customer@example.com",
      "customer_name": "Test Customer",
      "customer_purchase_ip": "203.0.113.42",
      "customer_signature": null,
      "duplicate_charge_documentation": null,
      "duplicate_charge_explanation": null,
      "duplicate_charge_id": null,
      "enhanced_evidence": {},
      "product_description": null,
      "receipt": "file_test_123",
      "refund_policy": null,
      "refund_policy_disclosure": null,
      "refund_refusal_explanation": null,
      "service_date": null,
      "service_documentation": null,
      "shipping_address": null,
      "shipping_carrier": null,
      "shipping_date": null,
      "shipping_documentation": null,
      "shipping_tracking_number": null,
      "uncategorized_file": null,
      "uncategorized_text": null
    },
    "evidence_details": {
      "due_by": 1763337599,
      "enhanced_eligibility": {},
      "has_evidence": false,
      "past_due": false,
      "submission_count": 0
    },
    "is_charge_refundable": false,
    "livemode": false,
    "metadata": {},
    "payment_intent": "pi_test_123",
    "payment_method_details": {
      "card": {
        "brand": "visa",
        "case_type": "chargeback",
        "network_reason_code": "13.1"
      },
      "type": "card"
    },
    "reason": "product_not_received",
    "status": "needs_response"
  },
  "previous_attributes": null
}