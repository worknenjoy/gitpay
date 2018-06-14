module.exports.update = {
  "id": "evt_1CcecMBrSjgsps2DMFZw5Tyx",
  "object": "event",
  "api_version": "2018-02-28",
  "created": 1528918014,
  "data": {
    "object": {
      "id": "tr_1CcGcaBrSjgsps2DGToaoNF5",
      "object": "transfer",
      "amount": 100,
      "amount_reversed": 0,
      "balance_transaction": "txn_1CcGcaBrSjgsps2DpCid2qWx",
      "created": 1528825772,
      "currency": "usd",
      "description": null,
      "destination": "acct_1CZ5vkLlCJ9CeQRe",
      "destination_payment": "py_1CcGcaLlCJ9CeQReQbg5dgtx",
      "livemode": true,
      "metadata": {},
      "reversals": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/transfers/tr_1CcGcaBrSjgsps2DGToaoNF5/reversals"
      },
      "reversed": false,
      "source_transaction": null,
      "source_type": "card",
      "transfer_group": "task_1"
    },
    "previous_attributes": null
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_7JDHTJnTPulDSK",
    "idempotency_key": null
  },
  "type": "transfer.created"
}

