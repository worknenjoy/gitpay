import React from 'react'
import { Box, InputBase, Typography } from '@mui/material'

type CheckoutAmountInputProps = {
  value: string
  onChange: (value: string) => void
  currency?: string
  autoFocus?: boolean
  /** Locks the amount once a checkout has been minted for it. */
  disabled?: boolean
  /** Called when the payer presses Enter — no <form> involved, so no implicit submit risk. */
  onEnter?: () => void
  /** Alignment of the whole box's content — match the surrounding layout. */
  align?: 'left' | 'center' | 'right'
}

const JUSTIFY_CONTENT: Record<'left' | 'center' | 'right', string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

/** Large tabular-nums amount entry, adapted from a static hero display into an input. */
const CheckoutAmountInput = ({
  value,
  onChange,
  currency = 'usd',
  autoFocus,
  disabled,
  onEnter,
  align = 'center'
}: CheckoutAmountInputProps) => {
  const justifyContent = JUSTIFY_CONTENT[align]

  return (
    <Box
      sx={{
        textAlign: align,
        py: 3,
        px: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 1.5,
        mb: 3,
        opacity: disabled ? 0.6 : 1
      }}
    >
      <Typography
        variant="caption"
        sx={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: 'text.secondary' }}
      >
        Amount to pay
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent, mt: 1 }}>
        <Typography sx={{ fontSize: 22, color: 'text.secondary', mr: 0.5 }}>$</Typography>
        <InputBase
          autoFocus={autoFocus}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onEnter?.()
            }
          }}
          disabled={disabled}
          type="number"
          inputProps={{ min: 0, step: '0.01', 'aria-label': 'Amount to pay' }}
          sx={{
            fontSize: 44,
            fontVariantNumeric: 'tabular-nums',
            width: 200,
            '& input': { textAlign: align, p: 0 }
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
        {currency.toUpperCase()}
      </Typography>
    </Box>
  )
}

export default CheckoutAmountInput
