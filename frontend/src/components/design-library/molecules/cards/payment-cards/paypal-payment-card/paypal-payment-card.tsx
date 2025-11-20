import { Card, CardContent, Checkbox, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '../../../../atoms/buttons/button/button'

export type PaypalPaymentCardProps = {
  taskId?: number
  user: any
  createOrder?: Function
  onClose?: Function
  order: any
  price?: any
  plan?: any
}

const PaypalPaymentCard: React.FC<PaypalPaymentCardProps> = (props) => {
  const { createOrder, price, plan, user, taskId, order } = props
  const [termsPaypal, setTermsPaypal] = useState(false)

  const triggerPayment = useCallback((createdOrder: any) => {
    if (createdOrder && createdOrder.payment_url) {
      window.location.href = createdOrder.payment_url
    } else {
      console.log('no payment_url found on order', createdOrder)
    }
  }, [])

  const agreeTermsPaypal = useCallback(() => {
    setTermsPaypal((prev) => !prev)
  }, [])

  const handleNewOrder = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (termsPaypal && createOrder) {
        createOrder({
          provider: 'paypal',
          currency: 'USD',
          amount: price,
          plan,
          userId: user.id,
          taskId
        })
          .then((created: any) => {
            if (created) {
              // eslint-disable-next-line no-console
              triggerPayment(created.data)
            } else {
              // eslint-disable-next-line no-console
              console.log('no paypal order', created)
            }
          })
          .catch((err: any) => {
            // eslint-disable-next-line no-console
            console.log('failed paypal order', err)
          })
      }
    },
    [termsPaypal, createOrder, price, plan, user, taskId, order, triggerPayment]
  )

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage
            id="payment.paypal.title"
            defaultMessage="Make a new payment with Paypal"
          />
        </Typography>
        <div>
          <Typography variant="body1" gutterBottom>
            <FormattedMessage
              id="payment.paypal.subtitle"
              defaultMessage="The user who solves this issue, once they activate their PayPal account on Gitpay, will be able to receive payment via PayPal"
            />
          </Typography>
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              width: '50%',
              marginTop: 40,
              background: '#ecf0f1',
              padding: 20
            }}
          >
            <Typography variant="body1" gutterBottom>
              <FormattedMessage
                id="payment.paypal.warning2"
                defaultMessage="By continuing with PayPal, you will initiate a pre-authorized payment. We will authorize the payment afterwards, and you will receive a confirmation from Paypal"
              />
            </Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              <Checkbox onChange={agreeTermsPaypal} />
              <FormattedMessage id="payment.paypal.confirm" defaultMessage="Ok, I accept." />
            </Typography>
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '100%', marginTop: 20 }}>
          <FormattedMessage
            id="payment.paypal.logo.title"
            defaultMessage="Make the payment with paypal"
          >
            {(msg) => (
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!termsPaypal || price === 0}
                onClick={handleNewOrder}
                label={
                  <div>
                    <span style={{ marginRight: 10, display: 'inline-block' }}>{msg}</span>
                    <img
                      width={32}
                      height={19}
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg"
                      alt="PayPal Logo"
                    />
                  </div>
                }
                completed={order.completed}
              />
            )}
          </FormattedMessage>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaypalPaymentCard
