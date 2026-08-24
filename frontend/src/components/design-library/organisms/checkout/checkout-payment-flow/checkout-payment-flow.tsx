import React from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { WhopCheckoutEmbed } from '@whop/checkout/react'
import CheckoutShell from '../checkout-shell/checkout-shell'
import CheckoutCard from '../../../molecules/checkout/checkout-card/checkout-card'
import CheckoutMerchantSummary from '../../../molecules/checkout/checkout-merchant-summary/checkout-merchant-summary'
import CheckoutAmountInput from '../../../atoms/checkout/checkout-amount-input/checkout-amount-input'
import CheckoutFootNote from '../../../atoms/checkout/checkout-foot-note/checkout-foot-note'

export type CheckoutPaymentFlowCheckout = {
  sessionId: string
  purchaseUrl?: string
}

export type CheckoutPaymentFlowProps = {
  title: string
  description?: string
  currency: string
  amount: string
  onAmountChange: (value: string) => void
  onContinue: () => void
  onChangeAmount: () => void
  submitting?: boolean
  submitError?: string | null
  checkout: CheckoutPaymentFlowCheckout | null
  whopEnvironment?: 'production' | 'sandbox'
  /** True once the embed reports the payment completed — replaces the flow with a thank-you card. */
  paid?: boolean
  /** Fired by the embed on completion. No `returnUrl` is set and `skipRedirect` is on, so
   * Whop never navigates the payer away — this is the only completion signal. Without it,
   * Whop falls back to its own default post-checkout redirect (a page on whop.com listing
   * every product under the platform company, unrelated to this specific payment). */
  onPaymentComplete: () => void
}

/**
 * Single-page, two-column checkout (order summary + amount on the left, payment
 * details on the right) — not a multi-step wizard. Whop requires the amount to be
 * fixed before a checkout can be minted, so the right column starts as a placeholder
 * and only loads the embedded Whop payment form once the payer confirms an amount
 * (via `onContinue`); both columns stay visible throughout, no page/step change.
 *
 * Presentational only — no network calls, no <form> (avoids implicit-submit bugs
 * from a stray button picking up type="submit"). The caller owns all state and API
 * calls, which is also what makes this safe to preview in Storybook.
 */
const CheckoutPaymentFlow = ({
  title,
  description,
  currency,
  amount,
  onAmountChange,
  onContinue,
  onChangeAmount,
  submitting,
  submitError,
  checkout,
  whopEnvironment = 'sandbox',
  paid,
  onPaymentComplete
}: CheckoutPaymentFlowProps) => {
  if (paid) {
    return (
      <CheckoutShell>
        <CheckoutCard title="Payment received">
          <Typography color="text.secondary">
            Thanks — your payment for &ldquo;{title}&rdquo; has been received.
          </Typography>
        </CheckoutCard>
      </CheckoutShell>
    )
  }

  return (
    <CheckoutShell maxWidth={900}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'flex-start'
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Confirm your payment
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Choose how much you want to pay.
          </Typography>
          <CheckoutMerchantSummary title={title} description={description} />
          <CheckoutAmountInput
            value={amount}
            onChange={onAmountChange}
            onEnter={onContinue}
            currency={currency}
            autoFocus
            disabled={Boolean(checkout)}
            align="right"
          />
          {submitError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'right' }}>
              {submitError}
            </Typography>
          )}
          {checkout ? (
            <Box sx={{ textAlign: 'right' }}>
              <Button type="button" variant="text" onClick={onChangeAmount}>
                Change amount
              </Button>
            </Box>
          ) : (
            <Button
              type="button"
              variant="contained"
              fullWidth
              size="large"
              onClick={onContinue}
              disabled={submitting || !amount || Number(amount) <= 0}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'Continue'}
            </Button>
          )}
        </Box>

        <Box sx={{ flex: 1, width: '100%' }}>
          <CheckoutCard title="Payment details">
            {checkout ? (
              <>
                <WhopCheckoutEmbed
                  sessionId={checkout.sessionId}
                  environment={whopEnvironment}
                  skipRedirect
                  onComplete={onPaymentComplete}
                />
                {checkout.purchaseUrl && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                  >
                    Trouble loading? <a href={checkout.purchaseUrl}>Pay on Whop instead</a>
                  </Typography>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                <Typography variant="body2">Enter an amount to continue.</Typography>
              </Box>
            )}
          </CheckoutCard>
          <CheckoutFootNote>Payments are processed securely by Whop.</CheckoutFootNote>
        </Box>
      </Box>
    </CheckoutShell>
  )
}

export default CheckoutPaymentFlow
