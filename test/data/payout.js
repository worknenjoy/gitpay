module.exports.update = {
  "id": "evt_1CdprOLlCJ9CeQRe4QDlbGRY",
  "object": "event",
  "account": "acct_1CZ5vkLlCJ9CeQRe",
  "api_version": "2018-02-28",
  "created": 1529199558,
  "data": {
    "object": {
      "id": "po_1CdprNLlCJ9CeQRefEuMMLo6",
      "object": "payout",
      "amount": 7311,
      "arrival_date": 1529280000,
      "automatic": true,
      "balance_transaction": "txn_1CdprOLlCJ9CeQRe7gBPy9Lo",
      "created": 1529199557,
      "currency": "brl",
      "description": "STRIPE TRANSFER",
      "destination": "ba_1CcMc3LlCJ9CeQReQ51OuWYM",
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "livemode": true,
      "metadata": {
      },
      "method": "standard",
      "source_type": "card",
      "statement_descriptor": null,
      "status": "in_transit",
      "type": "bank_account"
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "payout.created"
}

module.exports.done = {
  "id": "evt_1CeM4PLlCJ9CeQReQrtxB9GJ",
  "object": "event",
  "account": "acct_1CZ5vkLlCJ9CeQRe",
  "api_version": "2018-02-28",
  "created": 1529323373,
  "data": {
    "object": {
      "id": "po_1CdprNLlCJ9CeQRefEuMMLo6",
      "object": "payout",
      "amount": 7311,
      "arrival_date": 1529280000,
      "automatic": true,
      "balance_transaction": "txn_1CdprOLlCJ9CeQRe7gBPy9Lo",
      "created": 1529199557,
      "currency": "brl",
      "description": "STRIPE TRANSFER",
      "destination": "ba_1CcMc3LlCJ9CeQReQ51OuWYM",
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "livemode": true,
      "metadata": {
      },
      "method": "standard",
      "source_type": "card",
      "statement_descriptor": null,
      "status": "paid",
      "type": "bank_account"
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "payout.paid"
}
