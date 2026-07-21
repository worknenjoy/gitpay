import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Typography, CircularProgress, Box } from '@mui/material'

/**
 * Whop embedded checkout for bounty funding.
 * Creates an order with provider=whop (checkout configuration) then loads embed by session id.
 * Full @whop/checkout embed can replace the iframe/redirect when package is installed on the FE.
 */
const WhopCheckout = (props: any) => {
  const { task, price, user, createOrder, onClose, addNotification, plan } = props
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<{
    orderId?: number
    sessionId?: string
    paymentUrl?: string
  } | null>(null)

  const startCheckout = async () => {
    if (!price || Number(price) <= 0) {
      addNotification && addNotification('payment.message.error', 'Invalid amount')
      return
    }
    setLoading(true)
    try {
      const order = await createOrder({
        provider: 'whop',
        amount: price,
        currency: 'usd',
        email: user?.email,
        userId: user?.id,
        taskId: task?.id || task?.data?.id,
        plan: plan || 'open source'
      })
      setSession({
        orderId: order?.id,
        sessionId: order?.token || order?.source_id,
        paymentUrl: order?.payment_url
      })
    } catch (e: any) {
      addNotification &&
        addNotification('payment.message.error', e?.message || 'Failed to start Whop checkout')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-start when opened with price
    if (price && Number(price) > 0 && !session && !loading) {
      // wait for user action via button for clearer UX
    }
  }, [price])

  if (session?.paymentUrl) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          <FormattedMessage
            id="payment.whop.redirect"
            defaultMessage="Complete payment on Whop checkout"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Session: {session.sessionId}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={session.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClose && onClose()}
        >
          <FormattedMessage id="payment.whop.open" defaultMessage="Open Whop checkout" />
        </Button>
        {/* Embed hook: when @whop/checkout is installed, render WhopCheckoutEmbed sessionId={session.sessionId} */}
        <div
          data-whop-checkout-session={session.sessionId}
          data-whop-checkout-return-url={`${window.location.origin}/#/task/${task?.id || task?.data?.id}`}
          style={{ minHeight: 1 }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        <FormattedMessage
          id="payment.whop.title"
          defaultMessage="Pay with Whop"
        />
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <FormattedMessage
          id="payment.whop.subtitle"
          defaultMessage="Secure checkout powered by Whop"
        />
      </Typography>
      <Button
        variant="contained"
        color="primary"
        disabled={loading || !price}
        onClick={startCheckout}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        <FormattedMessage id="checkout.payment.action" defaultMessage="Pay" />
      </Button>
    </Box>
  )
}

export default WhopCheckout
