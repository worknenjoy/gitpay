module.exports.completed = {
  success: {
    "id": "evt_1Q2fklBrSjgsps2Dx0mEXsXv",
    "object": "event",
    "api_version": "2020-03-02",
    "created": 1727211273,
    "livemode": true,
    "pending_webhooks": 1,
    "request": {
      "id": null,
      "idempotency_key": "db21b83a-4485-4496-95e6-2263c1ce99bf"
    },
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_a1zDc6832lrf6EdPjW6D0XB103xyLa7yBxqUYi87tdcCvUCjupD7ZO9prV",
        "object": "checkout.session",
        "adaptive_pricing": {
          "enabled": true
        },
        "after_expiration": null,
        "allow_promotion_codes": false,
        "amount_subtotal": 100,
        "amount_total": 100,
        "automatic_tax": {
          "enabled": false,
          "liability": null,
          "provider": null,
          "status": null
        },
        "billing_address_collection": "auto",
        "cancel_url": "https://stripe.com",
        "client_reference_id": null,
        "client_secret": null,
        "collected_information": null,
        "consent": null,
        "consent_collection": null,
        "created": 1750598867,
        "currency": "usd",
        "currency_conversion": null,
        "custom_fields": [
        ],
        "custom_text": {
          "after_submit": null,
          "shipping_address": null,
          "submit": null,
          "terms_of_service_acceptance": null
        },
        "customer": null,
        "customer_creation": "if_required",
        "customer_details": {
          "address": {
            "city": null,
            "country": "DK",
            "line1": null,
            "line2": null,
            "postal_code": null,
            "state": null
          },
          "email": "alexanmtz@gmail.com",
          "name": "Alexandre Magno",
          "phone": null,
          "tax_exempt": "none",
          "tax_ids": [
          ]
        },
        "customer_email": null,
        "discounts": [
        ],
        "expires_at": 1750685267,
        "invoice": null,
        "invoice_creation": {
          "enabled": false,
          "invoice_data": {
            "account_tax_ids": null,
            "custom_fields": null,
            "description": null,
            "footer": null,
            "issuer": null,
            "metadata": {
            },
            "rendering_options": null
          }
        },
        "livemode": false,
        "locale": "auto",
        "metadata": {
        },
        "mode": "payment",
        "payment_intent": "pi_3RcoMHBrSjgsps2D1aOZ9Yl6",
        "payment_link": "plink_1RcnYCBrSjgsps2DsAPjr1km",
        "payment_method_collection": "always",
        "payment_method_configuration_details": null,
        "payment_method_options": {
          "card": {
            "request_three_d_secure": "automatic"
          }
        },
        "payment_method_types": [
          "card"
        ],
        "payment_status": "paid",
        "permissions": null,
        "phone_number_collection": {
          "enabled": false
        },
        "recovered_from": null,
        "saved_payment_method_options": null,
        "setup_intent": null,
        "shipping": null,
        "shipping_address_collection": null,
        "shipping_options": [
        ],
        "shipping_rate": null,
        "status": "complete",
        "submit_type": "auto",
        "subscription": null,
        "success_url": "https://stripe.com",
        "total_details": {
          "amount_discount": 0,
          "amount_shipping": 0,
          "amount_tax": 0
        },
        "ui_mode": "hosted",
        "url": null,
        "wallet_options": null
      }
    }
  },
};