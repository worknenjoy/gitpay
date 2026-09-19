import React from 'react'
import currencyMap from './currency-map'
import StatCard from '../stat-card/stat-card'

//Function to convert currency code to symbol
export function currencyCodeToSymbol(code) {
  return currencyMap[code.toLowerCase()].symbol || code
}

//Function to format amount from cents to decimal format
export function formatStripeAmount(amountInCents) {
  // Convert to a number in case it's a string
  let amount = Number(amountInCents)

  // Check if the conversion result is a valid number
  if (isNaN(amount)) {
    return 'Invalid amount'
  }

  // Convert cents to a decimal format and fix to 2 decimal places
  return (amount / 100).toFixed(2)
}

export const convertStripeAmountByCurrency = (amount, currency) => {
  const places = currencyMap[currency.toLowerCase()].decimalPlaces || 2
  return (amount / Math.pow(10, places)).toFixed(places)
}

type BalanceCardProps = {
  name: string | React.ReactNode
  balance: number
  currency?: string
  icon?: React.ReactNode
  note?: React.ReactNode
  onAdd?: (e: any) => void
  action?: React.PropsWithChildren<any>
  actionProps?: any
  completed?: boolean
  type?: 'decimal' | 'centavos'
}

const BalanceCard = ({
  name,
  balance,
  currency = 'USD',
  icon,
  note,
  onAdd,
  action,
  actionProps,
  completed,
  type = 'decimal'
}: BalanceCardProps) => {
  const places = currencyMap[currency.toLowerCase()]?.decimalPlaces ?? 2
  const formattedValue =
    type === 'decimal'
      ? balance.toLocaleString('en-US', {
          minimumFractionDigits: places,
          maximumFractionDigits: places
        })
      : convertStripeAmountByCurrency(balance, currency)

  return (
    <StatCard
      icon={icon}
      label={name}
      value={formattedValue}
      currency={currencyCodeToSymbol(currency)}
      note={note}
      onAdd={onAdd}
      action={action}
      actionProps={actionProps}
      completed={completed}
    />
  )
}

export default BalanceCard
