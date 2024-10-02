module.exports.paid = {
  "id": "evt_1Q2fklBrSjgsps2Dx0mEXsXv",
  "object": "event",
  "api_version": "2020-03-02",
  "created": 1727211273,
  "data": {
    "object": {
      "id": "in_1Q2fh8BrSjgsps2DUqQsGLDj",
      "object": "invoice",
      "account_country": "US",
      "account_name": "Work n Enjoy",
      "account_tax_ids": null,
      "amount_due": 10800,
      "amount_paid": 10800,
      "amount_remaining": 0,
      "amount_shipping": 0,
      "application": null,
      "application_fee_amount": null,
      "attempt_count": 1,
      "attempted": true,
      "auto_advance": false,
      "automatic_tax": {
        "enabled": false,
        "liability": null,
        "status": null
      },
      "automatically_finalizes_at": null,
      "billing_reason": "manual",
      "charge": "ch_3Q2fhABrSjgsps2D2NnVRPLa",
      "collection_method": "send_invoice",
      "created": 1727211050,
      "currency": "usd",
      "custom_fields": null,
      "customer": "cus_QsYn1aSStYv4tf",
      "customer_address": null,
      "customer_email": "alexanmtz@gmail.com",
      "customer_name": null,
      "customer_phone": null,
      "customer_shipping": null,
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
      "due_date": 1727215199,
      "effective_at": 1727211052,
      "ending_balance": 0,
      "footer": null,
      "from_invoice": null,
      "hosted_invoice_url": "https://invoice.stripe.com/i/acct_19qSWHBrSjgsps2D/test_YWNjdF8xOXFTV0hCclNqZ3NwczJELF9RdVVndzRGM21XWWJHMHY1YkJ5Ynk4OEhYNk5EQVpjLDExNzc1MjA3NQ0200jYcTOCX7?s=ap",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_19qSWHBrSjgsps2D/test_YWNjdF8xOXFTV0hCclNqZ3NwczJELF9RdVVndzRGM21XWWJHMHY1YkJ5Ynk4OEhYNk5EQVpjLDExNzc1MjA3NQ0200jYcTOCX7/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "object": "list",
        "data": [
          {
            "id": "il_1Q2fh9BrSjgsps2DFNoGRrJn",
            "object": "line_item",
            "amount": 10800,
            "amount_excluding_tax": 10800,
            "currency": "usd",
            "description": "Development service for solving an issue on Gitpay: Add language to issue on explore (http://localhost:3000/#/task/15)",
            "discount_amounts": [
            ],
            "discountable": true,
            "discounts": [
            ],
            "invoice": "in_1Q2fh8BrSjgsps2DUqQsGLDj",
            "invoice_item": "ii_1Q2fh9BrSjgsps2DGd5Ne9N9",
            "livemode": false,
            "metadata": {
              "task_id": "15",
              "order_id": "13"
            },
            "period": {
              "end": 1727211051,
              "start": 1727211051
            },
            "plan": null,
            "price": {
              "id": "price_1Q2fh9BrSjgsps2DKg2BTxW9",
              "object": "price",
              "active": false,
              "billing_scheme": "per_unit",
              "created": 1727211051,
              "currency": "usd",
              "custom_unit_amount": null,
              "livemode": false,
              "lookup_key": null,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_QuUgNDbkNeNAB3",
              "recurring": null,
              "tax_behavior": "unspecified",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "one_time",
              "unit_amount": 10800,
              "unit_amount_decimal": "10800"
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
            "type": "invoiceitem",
            "unit_amount_excluding_tax": "10800"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/invoices/in_1Q2fh8BrSjgsps2DUqQsGLDj/lines"
      },
      "livemode": false,
      "metadata": {
        "task_id": "15",
        "order_id": "13"
      },
      "next_payment_attempt": null,
      "number": "54B03F60-0003",
      "on_behalf_of": null,
      "paid": true,
      "paid_out_of_band": false,
      "payment_intent": "pi_3Q2fhABrSjgsps2D23ouBTWS",
      "payment_settings": {
        "default_mandate": null,
        "payment_method_options": null,
        "payment_method_types": null
      },
      "period_end": 1727211050,
      "period_start": 1727211050,
      "post_payment_credit_notes_amount": 0,
      "pre_payment_credit_notes_amount": 0,
      "quote": null,
      "receipt_number": null,
      "rendering": {
        "amount_tax_display": null,
        "pdf": {
          "page_size": "letter"
        },
        "template": null,
        "template_version": null
      },
      "rendering_options": null,
      "shipping_cost": null,
      "shipping_details": null,
      "starting_balance": 0,
      "statement_descriptor": null,
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1727211052,
        "marked_uncollectible_at": null,
        "paid_at": 1727211272,
        "voided_at": null
      },
      "subscription": null,
      "subscription_details": {
        "metadata": null
      },
      "subtotal": 10800,
      "subtotal_excluding_tax": 10800,
      "tax": null,
      "tax_percent": null,
      "test_clock": null,
      "total": 10800,
      "total_discount_amounts": [
      ],
      "total_excluding_tax": 10800,
      "total_tax_amounts": [
      ],
      "transfer_data": null,
      "webhooks_delivered_at": 1727211088
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_NA1krZygl8GkIZ",
    "idempotency_key": "46badf96-62d0-4c33-af32-63a676fe0c4e"
  },
  "type": "invoice.paid"
}