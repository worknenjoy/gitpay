import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Box, CircularProgress, Typography } from '@mui/material'
import CheckoutShell from 'design-library/organisms/checkout/checkout-shell/checkout-shell'
import CheckoutCard from 'design-library/molecules/checkout/checkout-card/checkout-card'
import CheckoutPaymentFlow, {
  CheckoutPaymentFlowCheckout
} from 'design-library/organisms/checkout/checkout-payment-flow/checkout-payment-flow'
import api from '../../../../../../consts'

const WHOP_ENVIRONMENT = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'

type PublicPaymentRequest = {
  title: string
  description?: string
  currency: string
  provider: string
  custom_amount: boolean
  active: boolean
}

/**
 * Data-fetching container for the public Whop custom-amount pay page. All UI/state
 * transitions live in CheckoutPaymentFlow (presentational, storied); this component
 * only wires it to the API.
 */
const PaymentRequestPayPage = () => {
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [paymentRequest, setPaymentRequest] = useState<PublicPaymentRequest | null>(null)
  const [loadError, setLoadError] = useState(false)

  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<CheckoutPaymentFlowCheckout | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${api.API_URL}/payment-requests-public/${id}/public`)
        setPaymentRequest(response.data)
      } catch {
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleContinue = async () => {
    if (!amount || Number(amount) <= 0) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const response = await axios.post(`${api.API_URL}/payment-requests-public/${id}/checkout`, {
        amount: Number(amount)
      })
      setCheckout(response.data)
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message || 'Could not start checkout. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeAmount = () => {
    setCheckout(null)
    setSubmitError(null)
  }

  if (loading) {
    return (
      <CheckoutShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      </CheckoutShell>
    )
  }

  if (loadError || !paymentRequest) {
    return (
      <CheckoutShell>
        <CheckoutCard title="Payment request not found">
          <Typography color="text.secondary">
            This payment link doesn't exist or may have been removed.
          </Typography>
        </CheckoutCard>
      </CheckoutShell>
    )
  }

  if (!paymentRequest.active) {
    return (
      <CheckoutShell>
        <CheckoutCard title="This payment link is no longer active">
          <Typography color="text.secondary">
            Please contact the person who sent you this link.
          </Typography>
        </CheckoutCard>
      </CheckoutShell>
    )
  }

  return (
    <CheckoutPaymentFlow
      title={paymentRequest.title}
      description={paymentRequest.description}
      currency={paymentRequest.currency}
      amount={amount}
      onAmountChange={setAmount}
      onContinue={handleContinue}
      onChangeAmount={handleChangeAmount}
      submitting={submitting}
      submitError={submitError}
      checkout={checkout}
      whopEnvironment={WHOP_ENVIRONMENT}
    />
  )
}

export default PaymentRequestPayPage
