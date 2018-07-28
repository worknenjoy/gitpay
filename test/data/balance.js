module.exports.update = {
    "id": "evt_1234",
    "object": "event",
    "api_version": "2018-02-28",
    "created": 1530508059,
    "data": {
      "object": {
        "object": "balance",
        "available": [
          {
            "currency": "usd",
            "amount": 6420,
            "source_types": {
              "card": 6420
            }
          },
          {
            "currency": "brl",
            "amount": -2448,
            "source_types": {
              "card": -2448
            }
          }
        ],
        "connect_reserved": [
          {
            "currency": "usd",
            "amount": 0
          },
          {
            "currency": "brl",
            "amount": 0
          }
        ],
        "livemode": true,
        "pending": [
          {
            "currency": "usd",
            "amount": 0,
            "source_types": {
              "card": 0
            }
          },
          {
            "currency": "brl",
            "amount": 0,
            "source_types": {
              "card": 0
            }
          }
        ]
      }
    },
    "livemode": true,
    "pending_webhooks": 1,
    "request": {
      "id": null,
      "idempotency_key": null
    },
    "type": "balance.available"
};