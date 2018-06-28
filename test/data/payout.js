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

module.exports.failed = {
  "id": "evt_1ChFtEAcSPl6ox0l3VSifPWa",
  "object": "event",
  "account": "acct_1CdjXFAcSPl6ox0l",
  "api_version": "2018-02-28",
  "created": 1530014600,
  "data": {
    "object": {
      "id": "po_1CgNDoAcSPl6ox0ljXdVYWx3",
      "object": "payout",
      "amount": 7409,
      "arrival_date": 1529884800,
      "automatic": true,
      "balance_transaction": "txn_1CgNDoAcSPl6ox0ldyOtyaAP",
      "created": 1529804456,
      "currency": "brl",
      "description": "STRIPE TRANSFER",
      "destination": "ba_1Ce0PIAcSPl6ox0lFYghLdq4",
      "failure_balance_transaction": "txn_1ChFtEAcSPl6ox0lUAWIKmOf",
      "failure_code": "could_not_process",
      "failure_message": "The bank could not process this transfer.",
      "livemode": true,
      "metadata": {
      },
      "method": "standard",
      "source_type": "card",
      "statement_descriptor": "Gitpay",
      "status": "failed",
      "type": "bank_account"
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "payout.failed"
}
