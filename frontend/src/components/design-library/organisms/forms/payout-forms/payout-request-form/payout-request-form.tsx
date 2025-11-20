import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { Grid } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Field from '../../../../atoms/inputs/fields/field/field'
import Checkboxes from 'design-library/atoms/inputs/checkboxes/checkboxes'
import BalanceCard, {
  convertStripeAmountByCurrency
} from 'design-library/molecules/cards/balance-card/balance-card'
import currencyMap from 'design-library/molecules/cards/balance-card/currency-map'
import { EndAdornment } from './payout-request-form.styles'

// styles moved to payout-request-form.styles.ts

interface PayoutRequestFormProps {
  onSubmit?: (e: any, data: any) => void
  onConfirmPayoutCheck?: (selected: boolean) => void
  onSetAmount: (value) => void
  completed?: boolean
  balance?: number
  currency?: string
}

type PayoutRequestFormHandle = {
  submit: () => void
}

const PayoutRequestForm = forwardRef<PayoutRequestFormHandle, PayoutRequestFormProps>(
  ({ onSubmit, completed = true, balance, currency, onConfirmPayoutCheck, onSetAmount }, ref) => {
    const internalFormRef = useRef<HTMLFormElement>(null)
    const amountInputRef = useRef<HTMLInputElement>(null)

    // Expose `submit` method to parent
    useImperativeHandle(ref, () => ({
      submit: () => {
        internalFormRef.current?.requestSubmit() // Triggers native submit event
      }
    }))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const data = Object.fromEntries(formData.entries())
      onSubmit?.(event, { ...data, currency: currency, method: 'bank_account' })
    }

    const handleAddBalance = () => {
      if (amountInputRef.current) {
        const formattedAmount = convertStripeAmountByCurrency(balance, currency).toString()
        const inputElement = amountInputRef.current // Find the input element inside the Field component

        if (inputElement) {
          inputElement.value = formattedAmount // Directly set the value
          const event = new Event('input', { bubbles: true })
          inputElement.dispatchEvent(event)
          inputElement.focus()
          onSetAmount(inputElement.value)
        }
      }
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maxAmount = Number(convertStripeAmountByCurrency(balance, currency))
      let value = Number(e.target.value)

      if (value > maxAmount) {
        value = maxAmount
      }
      if (value < 0) {
        value = 0
      }

      e.target.value = value.toString()
      onSetAmount(value)
    }

    const stepByCurrency = currencyMap[currency.toLowerCase()]?.decimalPlaces
      ? Math.pow(10, -currencyMap[currency.toLowerCase()].decimalPlaces)
      : 0.01

    return (
      <form onSubmit={handleSubmit} ref={internalFormRef}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }} justifyContent="flex-end">
            <BalanceCard
              name={
                <FormattedMessage
                  id="PayoutRequest.form.title"
                  defaultMessage="Available funds to payout to your account"
                />
              }
              balance={balance}
              currency={currency}
              action={
                <FormattedMessage
                  id="PayoutRequest.form.action"
                  defaultMessage="Use total balance"
                />
              }
              actionProps={{ disabled: balance === 0 }}
              onAdd={handleAddBalance}
              completed={completed}
              type="centavos"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Field
              label="Amount"
              name="amount"
              type="number"
              ref={amountInputRef}
              placeholder="Enter the amount"
              inputProps={{
                min: 0,
                step: stepByCurrency,
                max: convertStripeAmountByCurrency(balance, currency)
              }}
              completed={completed}
              disabled={balance === 0}
              endAdornment={
                <EndAdornment>
                  <i>{currency?.toUpperCase() || 'USD'}</i>
                </EndAdornment>
              }
              onChange={handleAmountChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Checkboxes
              checkboxes={[
                {
                  label: (
                    <FormattedMessage
                      id="PayoutRequest.form.confirm"
                      defaultMessage="I agree to transfer the funds from your current balance to your registered bank account. The amount will be included in the next payout."
                    />
                  ),
                  name: 'custom_amount',
                  value: true,
                  onChange: onConfirmPayoutCheck
                }
              ]}
              includeSelectAll={false}
            />
          </Grid>
        </Grid>
      </form>
    )
  }
)

export default PayoutRequestForm
