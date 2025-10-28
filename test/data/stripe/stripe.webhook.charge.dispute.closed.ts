export const disputeClosed = {
  "id": "evt_test_dispute_closed_1",
  "object": "event",
  "api_version": "2025-10-01",
  "created": 1758370389,
  "type": "charge.dispute.closed",
  "livemode": false,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "pending_webhooks": 1,
  "data": {
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
          "available_on": 1758370387,
          "balance_type": "payments",
          "created": 1758370387,
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
      "created": 1758370363,
      "currency": "usd",
      "enhanced_eligibility_types": [],
      "evidence": {
        "access_activity_log": null,
        "billing_address": "123 Test St\nAnytown, CA, 90210, US",
        "cancellation_policy": null,
        "cancellation_policy_disclosure": null,
        "cancellation_rebuttal": null,
        "customer_communication": "file_test_communication",
        "customer_email_address": "customer@example.com",
        "customer_name": "Test User",
        "customer_purchase_ip": "203.0.113.10",
        "customer_signature": null,
        "duplicate_charge_documentation": null,
        "duplicate_charge_explanation": null,
        "duplicate_charge_id": null,
        "enhanced_evidence": {},
        "product_description": "Marketing course",
        "receipt": null,
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
        "uncategorized_file": "file_test_uncategorized",
        "uncategorized_text": "Customer opened a dispute. See refund policy: https://example.com/refund-policy"
      },
      "evidence_details": {
        "due_by": 1759795199,
        "enhanced_eligibility": {},
        "has_evidence": true,
        "past_due": false,
        "submission_count": 1
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
      "status": "lost"
    }
  }
}
