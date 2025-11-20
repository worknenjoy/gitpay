module.exports.get = {
  total_items: 11,
  total_pages: 3,
  batch_header: {
    payout_batch_id: 'LEP6947CGTKRL',
    batch_status: 'SUCCESS',
    time_created: '2018-03-13T12:44:47Z',
    time_completed: '2018-03-13T12:44:55Z',
    time_closed: '2018-03-13T12:44:55Z',
    sender_batch_header: {
      email_subject: 'You got a Test'
    },
    amount: {
      currency: 'USD',
      value: '200.0'
    },
    fees: {
      currency: 'USD',
      value: '2.75'
    },
    displayable: true
  },
  items: [
    {
      payout_item_id: '5MYSR9GT8AEUG',
      transaction_id: '2JE19762AW167960J',
      activity_id: '0E158638XS0329103',
      transaction_status: 'SUCCESS',
      payout_item_fee: {
        currency: 'USD',
        value: '0.25'
      },
      payout_batch_id: 'LEP6947CGTKRL',
      payout_item: {
        recipient_type: 'PHONE',
        amount: {
          currency: 'USD',
          value: '50.0'
        },
        note: 'Mr. Rob',
        receiver: '93847858694',
        sender_item_id: 'X1'
      },
      time_processed: '2018-03-13T12:44:51Z',
      links: [
        {
          href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts-item/5MYSR9GT8AEUG',
          rel: 'item',
          method: 'GET'
        }
      ]
    },
    {
      payout_item_id: 'ZV967ZUVUGL9L',
      transaction_id: '8JG30981BP6452334',
      activity_id: '0E158638XS0329102',
      transaction_status: 'SUCCESS',
      payout_item_fee: {
        currency: 'USD',
        value: '0.25'
      },
      payout_batch_id: 'LEP6947CGTKRL',
      payout_item: {
        recipient_type: 'PHONE',
        amount: {
          currency: 'USD',
          value: '50.0'
        },
        note: 'Mr. Rob',
        receiver: '93847838694',
        sender_item_id: 'X12'
      },
      time_processed: '2018-03-13T12:44:51Z',
      links: [
        {
          href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts-item/ZV967ZUVUGL9L',
          rel: 'item',
          method: 'GET'
        }
      ]
    },
    {
      payout_item_id: '7X73FYJYFQGES',
      transaction_id: '8S043803CK444682D',
      activity_id: '0E158638XS0329101',
      transaction_status: 'SUCCESS',
      payout_item_fee: {
        currency: 'USD',
        value: '0.25'
      },
      payout_batch_id: 'LEP6947CGTKRL',
      payout_item: {
        recipient_type: 'PHONE',
        amount: {
          currency: 'USD',
          value: '50.0'
        },
        note: 'Mr. Rob',
        receiver: '92847858694',
        sender_item_id: 'X13'
      },
      time_processed: '2018-03-13T12:44:54Z',
      links: [
        {
          href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts-item/7X73FYJYFQGES',
          rel: 'item',
          method: 'GET'
        }
      ]
    },
    {
      payout_item_id: 'KBN2UQVSP8YDA',
      transaction_id: '13947164DM210580M',
      activity_id: '0E158638XS0329109',
      transaction_status: 'SUCCESS',
      payout_item_fee: {
        currency: 'USD',
        value: '0.25'
      },
      payout_batch_id: 'LEP6947CGTKRL',
      payout_item: {
        recipient_type: 'PHONE',
        amount: {
          currency: 'USD',
          value: '50.0'
        },
        note: 'Mr. Rob',
        receiver: '93847878694',
        sender_item_id: 'X14'
      },
      time_processed: '2018-03-13T12:44:55Z',
      links: [
        {
          href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts-item/KBN2UQVSP8YDA',
          rel: 'item',
          method: 'GET'
        }
      ]
    },
    {
      payout_item_id: 'X74HTBHMHAVG2',
      transaction_id: '30E82346NA368651S',
      transaction_status: 'SUCCESS',
      activity_id: '0E158638XS0329108',
      payout_item_fee: {
        currency: 'USD',
        value: '0.25'
      },
      payout_batch_id: 'LEP6947CGTKRL',
      payout_item: {
        recipient_type: 'PHONE',
        amount: {
          currency: 'USD',
          value: '50.0'
        },
        note: 'Mr. Rob',
        receiver: '93847828694',
        sender_item_id: 'X15'
      },
      time_processed: '2018-03-13T12:44:51Z',
      links: [
        {
          href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts-item/X74HTBHMHAVG2',
          rel: 'item',
          method: 'GET'
        }
      ]
    }
  ],
  links: [
    {
      href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts/LEP6947CGTKRL?page_size=5&page=2',
      rel: 'next',
      method: 'GET'
    },
    {
      href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts/LEP6947CGTKRL?page_size=5&page=3',
      rel: 'last',
      method: 'GET'
    },
    {
      href: 'https://api-m.sandbox.paypal.com/v1/payments/payouts/LEP6947CGTKRL?page_size=5&page=1',
      rel: 'self',
      method: 'GET'
    }
  ]
}
