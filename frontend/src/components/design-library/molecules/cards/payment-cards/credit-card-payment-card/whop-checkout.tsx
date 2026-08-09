import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Typography, CircularProgress, Box, Alert } from '@mui/material'

/**
 * Extract order payload from createOrder thunk return value.
 * Redux thunk returns the action `{ type, completed, data }` on success,
 * or an error action / axios-shaped object on failure.
 */
function resolveOrderFromCreateResult(result: any): any | null {
  if (!result) return null
  // Action: { type: CREATE_ORDER_SUCCESS, data: order }
  if (result.data && (result.data.id || result.data.payment_url || result.data.source_id)) {
    return result.data
  }
  // Raw order (tests / direct calls)
  if (result.id || result.payment_url || result.source_id) {
    return result
  }
  return null
}

/**
 * Whop checkout for bounty funding.
 * Creates an order (checkout_configuration) then redirects to Whop purchase_url.
 */
const WhopCheckout = (props: any) => {
  const {
    task,
    price,
    formatedPrice,
    user,
    createOrder,
    onClose,
    addNotification,
    plan
  } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<{
    orderId?: number
    sessionId?: string
    paymentUrl?: string
  } | null>(null)

  const taskId = task?.id || task?.data?.id
  const displayPrice =
    formatedPrice ||
    (price != null && Number(price) > 0
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price))
      : null)

  const openCheckoutUrl = (url: string) => {
    // Prefer same-tab navigation so return_url / browser back works; fall back to new tab
    try {
      window.location.assign(url)
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    if (onClose) onClose()
  }

  const startCheckout = async () => {
    if (!price || Number(price) <= 0) {
      addNotification && addNotification('payment.message.error', 'Invalid amount')
      return
    }
    if (typeof createOrder !== 'function') {
      const msg = 'Checkout is not available (createOrder missing)'
      setError(msg)
      addNotification && addNotification('payment.message.error', msg)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await createOrder({
        provider: 'whop',
        amount: price,
        currency: 'usd',
        email: user?.email,
        userId: user?.id,
        taskId,
        plan: plan || 'open source'
      })

      // Error action / failed create
      if (result?.error || (result?.completed === true && !result?.data && result?.type?.includes('ERROR'))) {
        const msg =
          result?.error?.message ||
          result?.error?.response?.data?.error ||
          'Failed to start Whop checkout'
        setError(String(msg))
        addNotification && addNotification('payment.message.error', msg)
        return
      }

      const order = resolveOrderFromCreateResult(result)
      if (!order) {
        const msg = 'Order created but checkout URL is missing'
        setError(msg)
        addNotification && addNotification('payment.message.error', msg)
        return
      }

      const paymentUrl = order.payment_url || order.paymentUrl
      const sessionId = order.token || order.source_id || order.sessionId

      setSession({
        orderId: order.id,
        sessionId,
        paymentUrl
      })

      if (paymentUrl) {
        openCheckoutUrl(paymentUrl)
        return
      }

      setError(
        'Whop did not return a checkout URL. Check WHOP_API_KEY / company setup, or open the session from the order details.'
      )
    } catch (e: any) {
      const msg = e?.message || 'Failed to start Whop checkout'
      setError(msg)
      addNotification && addNotification('payment.message.error', msg)
    } finally {
      setLoading(false)
    }
  }

  if (session?.paymentUrl) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          <FormattedMessage
            id="payment.whop.redirect"
            defaultMessage="Redirecting to Whop checkout…"
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
        <div
          data-whop-checkout-session={session.sessionId}
          data-whop-checkout-return-url={`${window.location.origin}/#/task/${taskId}`}
          style={{ minHeight: 1 }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        <FormattedMessage id="payment.whop.title" defaultMessage="Pay with Whop" />
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <FormattedMessage
          id="payment.whop.subtitle"
          defaultMessage="Secure checkout powered by Whop. You will be redirected to complete payment."
        />
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Button
        variant="contained"
        color="primary"
        disabled={loading || !price || Number(price) <= 0}
        onClick={startCheckout}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        <FormattedMessage
          id="checkout.payment.action"
          defaultMessage="Pay {price}"
          values={{ price: displayPrice || '' }}
        />
      </Button>
    </Box>
  )
}

export default WhopCheckout
