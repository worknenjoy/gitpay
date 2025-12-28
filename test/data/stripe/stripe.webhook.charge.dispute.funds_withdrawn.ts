export const disputeFundsWithdrawn = {
  "id": "evt_test_charge_dispute_funds_withdrawn",
  "object": "event",
  "api_version": "2020-03-02",
  "created": 1766730747,
  "data": {
    "object": {
      "id": "du_test_charge_dispute",
      "object": "dispute",
      "amount": 4995,
      "balance_transaction": "txn_test_dispute_balance",
      "balance_transactions": [
        {
          "id": "txn_test_dispute_balance",
          "object": "balance_transaction",
          "amount": -4995,
          "available_on": 1766730746,
          "balance_type": "payments",
          "created": 1766730746,
          "currency": "usd",
          "description": "Chargeback withdrawal for ch_test_charge",
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
          "source": "du_test_charge_dispute",
          "status": "available",
          "type": "adjustment"
        }
      ],
      "charge": "ch_test_charge",
      "created": 1766730733,
      "currency": "usd",
      "enhanced_eligibility_types": [],
      "evidence": {
        "access_activity_log": null,
        "billing_address": "123 Test St\nApt 1\nTest City, CA, 90210, US",
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
        "receipt": "file_test_receipt",
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
        "due_by": 1768089599,
        "enhanced_eligibility": {},
        "has_evidence": false,
        "past_due": false,
        "submission_count": 0
      },
      "is_charge_refundable": false,
      "livemode": true,
      "metadata": {},
      "payment_intent": "pi_test_payment_intent",
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
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "charge.dispute.funds_withdrawn"
}