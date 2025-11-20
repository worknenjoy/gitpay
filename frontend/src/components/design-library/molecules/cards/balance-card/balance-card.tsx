import React from 'react'
import { Button, CardContent, CardActions, Skeleton } from '@mui/material'
import currencyMap from './currency-map'
import { RootCard, Balance as BalanceText, Name as NameText } from './balance-card.styles'
import { formatCurrency } from '../../../../../utils/format-currency'

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

// styles migrated to balance-card.styles.ts

type BalanceCardProps = {
  name: string | React.ReactNode
  balance: number
  currency?: string
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
  onAdd,
  action,
  actionProps,
  completed,
  type = 'decimal'
}: BalanceCardProps) => {
  const convertedBalance =
    type === 'decimal'
      ? formatCurrency(balance)
      : `${currencyCodeToSymbol(currency)} ${convertStripeAmountByCurrency(balance, currency)}`

  const isLoading = completed === false

  return (
    <RootCard>
      <CardContent>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Skeleton variant="text" animation="wave" height={40} width="60%" />
            <Skeleton variant="rectangular" animation="wave" width="40%" height={100} />
          </div>
        ) : (
          <>
            <NameText gutterBottom>{name}</NameText>
            <BalanceText>{convertedBalance}</BalanceText>
          </>
        )}
      </CardContent>
      {onAdd && action && (
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={onAdd}
            {...actionProps}
          >
            {action}
          </Button>
        </CardActions>
      )}
    </RootCard>
  )
}

export default BalanceCard
