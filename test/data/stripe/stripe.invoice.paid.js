module.exports.paid = {
  "id": ["evt_1KkomkBrSjgsps2DGGBtipW4"], // (https://dashboard.stripe.com/events/evt_1KkomkBrSjgsps2DGGBtipW4),
  "object": "event",
  "api_version": "2020-03-02",
  "created": 1649074409,
  "data": {
    "object": {
      "id": ["in_1KknpoBrSjgsps2DMwiQEzJ9"], // (https://dashboard.stripe.com/invoices/in_1KknpoBrSjgsps2DMwiQEzJ9),
      "object": "invoice",
      "account_country": "US",
      "account_name": "worknenjoy, Inc.",
      "account_tax_ids": null,
      "amount_due": 37760,
      "amount_paid": 37760,
      "amount_remaining": 0,
      "application_fee_amount": null,
      "attempt_count": 1,
      "attempted": true,
      "auto_advance": false,
      "automatic_tax": {
        "enabled": false,
        "status": null
      },
      "billing_reason": "manual",
      "charge": ["ch_3KknvTBrSjgsps2D036v7gVJ"], // (https://dashboard.stripe.com/payments/ch_3KknvTBrSjgsps2D036v7gVJ),
      "collection_method": "send_invoice",
      "created": 1649070756,
      "currency": "usd",
      "custom_fields": [
        {
          "name": "task_id",
          "value": "609"
        }
      ],
      "customer": ["cus_J4zTz8uySTkLlL"], // (https://dashboard.stripe.com/customers/cus_J4zTz8uySTkLlL),
      "customer_address": null,
      "customer_email": "test@fitnowbrasil.com.br",
      "customer_name": "Test",
      "customer_phone": null,
      "customer_shipping": {
        "address": {
          "city": "",
          "country": "",
          "line1": "",
          "line2": "",
          "postal_code": "",
          "state": ""
        },
        "name": "Test",
        "phone": ""
      },
      "customer_tax_exempt": "none",
      "customer_tax_ids": [
      ],
      "default_payment_method": null,
      "default_source": null,
      "default_tax_rates": [
      ],
      "description": "",
      "discount": null,
      "discounts": [
      ],
      "due_date": 1651663107,
      "ending_balance": 0,
      "footer": "Adjustments on the app flow to be approved on Apple Store",
      "hosted_invoice_url": "https://invoice.stripe.com/i/acct_19qSWHBrSjgsps2D/live_YWNjdF8xOXFTV0hCclNqZ3NwczJELF9MUmhFUXc4WkpId3I2cUdMdmRybEJxN1lSZk5SZmpNLDM5NjE1MjEw0200i7wd6fIN?s=ap",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_19qSWHBrSjgsps2D/live_YWNjdF8xOXFTV0hCclNqZ3NwczJELF9MUmhFUXc4WkpId3I2cUdMdmRybEJxN1lSZk5SZmpNLDM5NjE1MjEw0200i7wd6fIN/pdf?s=ap",
      "last_finalization_error": null,
      "lines": {
        "object": "list",
        "data": [
          {
            "id": ["il_1KknpoBrSjgsps2Difan8czG"], // (https://dashboard.stripe.com/line_items/il_1KknpoBrSjgsps2Difan8czG),
            "object": "line_item",
            "amount": 37760,
            "currency": "usd",
            "description": "Development service for a task on Gitpay: https://gitpay.me/#/task/609",
            "discount_amounts": [
            ],
            "discountable": true,
            "discounts": [
            ],
            "invoice_item": "ii_1KknpoBrSjgsps2DoUSzJLiO",
            "livemode": true,
            "metadata": {
              "task_id": "609",
              "order_id": "444"
            },
            "period": {
              "end": 1649070756,
              "start": 1649070756
            },
            "plan": null,
            "price": {
              "id": ["price_1KknpgBrSjgsps2DLKbhlCB2"], // (https://dashboard.stripe.com/prices/price_1KknpgBrSjgsps2DLKbhlCB2),
              "object": "price",
              "active": false,
              "billing_scheme": "per_unit",
              "created": 1649070748,
              "currency": "usd",
              "livemode": true,
              "lookup_key": null,
              "metadata": {
              },
              "nickname": null,
              "product": ["prod_LMRqROwn9P29Dh"], // (https://dashboard.stripe.com/products/prod_LMRqROwn9P29Dh),
              "recurring": null,
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "one_time",
              "unit_amount": 37760,
              "unit_amount_decimal": "37760"
            },
            "proration": false,
            "proration_details": {
              "credited_items": null
            },
            "quantity": 1,
            "subscription": null,
            "tax_amounts": [
            ],
            "tax_rates": [
            ],
            "type": "invoiceitem"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/invoices/in_1KknpoBrSjgsps2DMwiQEzJ9/lines"
      },
      "livemode": true,
      "metadata": {
      },
      "next_payment_attempt": null,
      "number": "USD-0023",
      "on_behalf_of": null,
      "paid": true,
      "paid_out_of_band": false,
      "payment_intent": ["pi_3KknvTBrSjgsps2D0aJYD07Q"], // (https://dashboard.stripe.com/payments/pi_3KknvTBrSjgsps2D0aJYD07Q),
      "payment_settings": {
        "payment_method_options": null,
        "payment_method_types": null
      },
      "period_end": 1649070748,
      "period_start": 1649070748,
      "post_payment_credit_notes_amount": 0,
      "pre_payment_credit_notes_amount": 0,
      "quote": null,
      "receipt_number": "2145-3666",
      "starting_balance": 0,
      "statement_descriptor": null,
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1649071107,
        "marked_uncollectible_at": null,
        "paid_at": 1649074409,
        "voided_at": null
      },
      "subscription": null,
      "subtotal": 37760,
      "tax": null,
      "tax_percent": null,
      "test_clock": null,
      "total": 37760,
      "total_discount_amounts": [
      ],
      "total_tax_amounts": [
      ],
      "transfer_data": null,
      "webhooks_delivered_at": 1649070757
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_QIRDAI7gYvjpbj",
    "idempotency_key": "854d1616-b48d-492f-b47e-d5ba5c92595c"
  },
  "type": "invoice.payment_succeeded"
}
